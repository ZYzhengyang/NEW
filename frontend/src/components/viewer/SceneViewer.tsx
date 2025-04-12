import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

interface SceneViewerProps {
  modelUrl: string
  animationUrls?: string[]
  modelType?: 'fbx' | 'gltf'
  width?: string
  height?: string
  background?: string
}

const SceneViewer = ({
  modelUrl,
  animationUrls = [],
  modelType = 'fbx',
  width = '100%',
  height = '500px',
  background = '#f5f5f5'
}: SceneViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    controls: OrbitControls
    mixer?: THREE.AnimationMixer
    clock: THREE.Clock
    model?: THREE.Object3D
    animations: THREE.AnimationClip[]
  }>()
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentAnimation, setCurrentAnimation] = useState<number>(-1)
  
  // 初始化场景
  useEffect(() => {
    if (!containerRef.current) return
    
    // 创建场景
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(background)
    
    // 创建相机
    const camera = new THREE.PerspectiveCamera(50, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000)
    camera.position.set(0, 100, 300)
    
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.shadowMap.enabled = true
    containerRef.current.appendChild(renderer.domElement)
    
    // 添加轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    
    // 添加灯光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(0, 200, 100)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)
    
    // 添加地板
    const planeGeometry = new THREE.PlaneGeometry(1000, 1000)
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.rotation.x = -Math.PI / 2
    plane.position.y = 0
    plane.receiveShadow = true
    scene.add(plane)
    
    // 创建时钟
    const clock = new THREE.Clock()
    
    // 保存引用
    sceneRef.current = {
      scene,
      camera,
      renderer,
      controls,
      clock,
      animations: []
    }
    
    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate)
      
      if (sceneRef.current?.mixer) {
        sceneRef.current.mixer.update(sceneRef.current.clock.getDelta())
      }
      
      if (sceneRef.current?.controls) {
        sceneRef.current.controls.update()
      }
      
      sceneRef.current?.renderer.render(sceneRef.current.scene, sceneRef.current.camera)
    }
    
    animate()
    
    // 窗口大小调整
    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current) return
      
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      
      sceneRef.current.camera.aspect = width / height
      sceneRef.current.camera.updateProjectionMatrix()
      
      sceneRef.current.renderer.setSize(width, height)
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      
      if (containerRef.current && sceneRef.current) {
        containerRef.current.removeChild(sceneRef.current.renderer.domElement)
      }
    }
  }, [background])
  
  // 加载模型
  useEffect(() => {
    if (!sceneRef.current || !modelUrl) return
    
    setIsLoading(true)
    setError(null)
    
    // 清除现有模型
    if (sceneRef.current.model) {
      sceneRef.current.scene.remove(sceneRef.current.model)
      sceneRef.current.model = undefined
      sceneRef.current.mixer = undefined
      sceneRef.current.animations = []
    }
    
    const loadModel = () => {
      let loader
      
      if (modelType === 'fbx') {
        loader = new FBXLoader()
      } else if (modelType === 'gltf') {
        loader = new GLTFLoader()
      } else {
        setError('不支持的模型类型')
        setIsLoading(false)
        return
      }
      
      loader.load(
        modelUrl,
        (object) => {
          let model: THREE.Object3D
          let animations: THREE.AnimationClip[] = []
          
          if (modelType === 'fbx') {
            model = object
            animations = object.animations
          } else {
            model = object.scene
            animations = object.animations || []
          }
          
          // 调整模型大小和位置
          const box = new THREE.Box3().setFromObject(model)
          const size = box.getSize(new THREE.Vector3()).length()
          const center = box.getCenter(new THREE.Vector3())
          
          model.position.x = -center.x
          model.position.y = -center.y + box.getSize(new THREE.Vector3()).y / 2
          model.position.z = -center.z
          
          const scale = 100 / size
          model.scale.set(scale, scale, scale)
          
          // 启用阴影
          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true
              child.receiveShadow = true
            }
          })
          
          sceneRef.current!.scene.add(model)
          sceneRef.current!.model = model
          
          // 创建动画混合器
          const mixer = new THREE.AnimationMixer(model)
          sceneRef.current!.mixer = mixer
          sceneRef.current!.animations = animations
          
          setIsLoading(false)
        },
        (xhr) => {
          // 加载进度
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
          console.error('模型加载错误', error)
          setError('模型加载失败')
          setIsLoading(false)
        }
      )
    }
    
    loadModel()
  }, [modelUrl, modelType])
  
  // 加载动画
  useEffect(() => {
    if (!sceneRef.current || !sceneRef.current.model || !sceneRef.current.mixer || animationUrls.length === 0) return
    
    // 只有在外部动画URL提供时才进行加载
    if (animationUrls.length > 0 && currentAnimation >= 0 && currentAnimation < animationUrls.length) {
      setIsLoading(true)
      
      const fbxLoader = new FBXLoader()
      fbxLoader.load(
        animationUrls[currentAnimation],
        (object) => {
          if (object.animations && object.animations.length > 0) {
            const action = sceneRef.current!.mixer!.clipAction(object.animations[0])
            
            // 停止当前所有动画
            sceneRef.current!.mixer!.stopAllAction()
            
            // 播放新动画
            action.play()
          }
          
          setIsLoading(false)
        },
        undefined,
        (error) => {
          console.error('动画加载错误', error)
          setError('动画加载失败')
          setIsLoading(false)
        }
      )
    } else if (sceneRef.current.animations.length > 0 && currentAnimation >= 0 && currentAnimation < sceneRef.current.animations.length) {
      // 如果模型自带动画，直接播放
      sceneRef.current.mixer.stopAllAction()
      
      const action = sceneRef.current.mixer.clipAction(sceneRef.current.animations[currentAnimation])
      action.play()
    }
  }, [currentAnimation, animationUrls])
  
  return (
    <div className="relative" style={{ width, height }}>
      <div ref={containerRef} className="w-full h-full" />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 text-white">
          <div className="text-center">
            <div className="mb-2 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p>加载中...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-30 text-white">
          <p>{error}</p>
        </div>
      )}
      
      {animationUrls.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 rounded-md bg-black bg-opacity-50 p-3">
          <button
            className={`rounded px-2 py-1 text-xs text-white ${currentAnimation === -1 ? 'bg-blue-500' : 'bg-gray-700'}`}
            onClick={() => setCurrentAnimation(-1)}
          >
            无动画
          </button>
          {animationUrls.map((_, index) => (
            <button
              key={index}
              className={`rounded px-2 py-1 text-xs text-white ${currentAnimation === index ? 'bg-blue-500' : 'bg-gray-700'}`}
              onClick={() => setCurrentAnimation(index)}
            >
              动画 {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SceneViewer 