import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import { gsap } from 'gsap'

function ModelViewer({ modelUrl, animations, currentAnimation, isPlaying }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const mixerRef = useRef(null)
  const clockRef = useRef(null)
  const statsRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    // 初始化场景
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x111111)
    sceneRef.current = scene

    // 初始化相机
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 1.5, 3)

    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.shadowMap.enabled = true
    containerRef.current.appendChild(renderer.domElement)

    // 添加控制器
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 1
    controls.maxDistance = 10
    controls.target.set(0, 1, 0)

    // 添加灯光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // 添加网格
    const gridHelper = new THREE.GridHelper(10, 10)
    scene.add(gridHelper)

    // 添加性能监控
    const stats = new Stats()
    stats.dom.style.position = 'absolute'
    stats.dom.style.top = '0px'
    containerRef.current.appendChild(stats.dom)
    statsRef.current = stats

    // 初始化时钟
    clockRef.current = new THREE.Clock()

    // 加载模型
    const loader = new GLTFLoader()
    loader.load(
      modelUrl,
      (gltf) => {
        scene.add(gltf.scene)

        // 设置模型位置和缩放
        gltf.scene.position.set(0, 0, 0)
        gltf.scene.scale.set(1, 1, 1)

        // 创建动画混合器
        const mixer = new THREE.AnimationMixer(gltf.scene)
        mixerRef.current = mixer

        // 播放动画
        if (gltf.animations.length > 0) {
          const action = mixer.clipAction(gltf.animations[currentAnimation])
          action.play()
        }
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%')
      },
      (error) => {
        console.error('Error loading model:', error)
      }
    )

    // 动画循环
    function animate() {
      requestAnimationFrame(animate)
      
      if (mixerRef.current && isPlaying) {
        const delta = clockRef.current.getDelta()
        mixerRef.current.update(delta)
      }

      controls.update()
      renderer.render(scene, camera)
      statsRef.current.update()
    }
    animate()

    // 窗口大小变化处理
    function handleResize() {
      if (!containerRef.current) return
      
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize)
      containerRef.current?.removeChild(renderer.domElement)
      containerRef.current?.removeChild(statsRef.current.dom)
      renderer.dispose()
    }
  }, [modelUrl])

  // 切换动画
  useEffect(() => {
    if (!mixerRef.current) return

    mixerRef.current.stopAllAction()
    const action = mixerRef.current.clipAction(animations[currentAnimation])
    action.play()
  }, [currentAnimation, animations])

  // 控制播放状态
  useEffect(() => {
    if (!mixerRef.current) return

    if (isPlaying) {
      mixerRef.current.timeScale = 1
    } else {
      mixerRef.current.timeScale = 0
    }
  }, [isPlaying])

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '8px'
      }}
    />
  )
}

export default ModelViewer 