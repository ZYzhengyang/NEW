import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import Stats from 'three/examples/jsm/libs/stats.module';
import { gsap } from 'gsap';

import './EnhancedModelViewer.css';

const EnhancedModelViewer = ({ modelUrl, animations = [], initialAnimation = 0 }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const mixerRef = useRef(null);
  const clockRef = useRef(null);
  const statsRef = useRef(null);
  const resourceTrackerRef = useRef(null);
  const animationActionsRef = useRef([]);

  // UI状态
  const [currentAnimation, setCurrentAnimation] = useState(initialAnimation);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [bgColor, setBgColor] = useState('#111111');
  const [infoMode, setInfoMode] = useState('none'); // 'none', 'header', 'sidebar'
  const [modelInfo, setModelInfo] = useState({
    vertices: 0,
    faces: 0,
    bones: 0,
    animations: [],
    frameTime: 0,
    memoryUsage: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // 资源跟踪器 - 用于在组件卸载时清理资源
  class ResourceTracker {
    constructor() {
      this.resources = new Set();
    }
    
    track(resource) {
      if (resource.dispose || resource instanceof THREE.Object3D) {
        this.resources.add(resource);
      }
      return resource;
    }
    
    untrack(resource) {
      this.resources.delete(resource);
    }
    
    dispose() {
      for (const resource of this.resources) {
        if (resource instanceof THREE.Object3D) {
          if (resource.parent) {
            resource.parent.remove(resource);
          }
        }
        if (resource.dispose) {
          resource.dispose();
        }
      }
      this.resources.clear();
    }
  }

  // 初始化场景
  useEffect(() => {
    if (!containerRef.current) return;
    
    // 创建资源跟踪器
    const resourceTracker = new ResourceTracker();
    resourceTrackerRef.current = resourceTracker;
    
    // 创建场景
    const scene = resourceTracker.track(new THREE.Scene());
    scene.background = new THREE.Color(bgColor);
    sceneRef.current = scene;
    
    // 创建相机
    const camera = resourceTracker.track(new THREE.PerspectiveCamera(
      60, 
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    ));
    camera.position.set(0, 1.5, 3);
    cameraRef.current = camera;
    
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      logarithmicDepthBuffer: true
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // 创建控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = true;
    controls.minDistance = 1;
    controls.maxDistance = 100;
    controls.target.set(0, 1, 0);
    controlsRef.current = controls;
    
    // 添加网格
    const grid = resourceTracker.track(new THREE.GridHelper(20, 20, 0xD4AF37, 0x333333));
    grid.visible = showGrid;
    scene.add(grid);
    
    // 添加坐标轴
    const axes = resourceTracker.track(new THREE.AxesHelper(5));
    axes.visible = showAxes;
    scene.add(axes);
    
    // 添加灯光
    const ambientLight = resourceTracker.track(new THREE.AmbientLight(0xffffff, 0.5));
    scene.add(ambientLight);
    
    const directionalLight = resourceTracker.track(new THREE.DirectionalLight(0xffffff, 0.8));
    directionalLight.position.set(50, 200, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    scene.add(directionalLight);
    
    const hemisphereLight = resourceTracker.track(new THREE.HemisphereLight(0xffffff, 0x444444, 0.3));
    scene.add(hemisphereLight);
    
    // 添加地板
    const floorGeometry = resourceTracker.track(new THREE.PlaneGeometry(200, 200));
    const floorMaterial = resourceTracker.track(new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.8,
      metalness: 0.2,
      side: THREE.DoubleSide
    }));
    const floor = resourceTracker.track(new THREE.Mesh(floorGeometry, floorMaterial));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // 添加性能监控
    const stats = new Stats();
    stats.dom.style.position = 'absolute';
    stats.dom.style.top = '0px';
    stats.dom.style.left = '0px';
    containerRef.current.appendChild(stats.dom);
    statsRef.current = stats;
    
    // 创建时钟
    clockRef.current = new THREE.Clock();
    
    // 加载环境贴图
    new RGBELoader()
      .setPath('https://threejs.org/examples/textures/equirectangular/')
      .load('royal_esplanade_1k.hdr', (hdrMap) => {
        hdrMap.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = resourceTracker.track(hdrMap);
      });
    
    // 窗口大小变化处理
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // 开始渲染循环
    const animate = () => {
      requestAnimationFrame(animate);
      
      // 更新控制器
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      // 更新动画混合器
      if (mixerRef.current && isPlaying) {
        const delta = clockRef.current.getDelta();
        mixerRef.current.update(delta * playbackSpeed);
        
        // 更新当前帧信息
        if (animationActionsRef.current.length > 0 && currentAnimation < animationActionsRef.current.length) {
          const action = animationActionsRef.current[currentAnimation];
          if (action) {
            const clip = action.getClip();
            const currentTime = action.time;
            const duration = clip.duration;
            const fps = 30; // 默认FPS
            
            const frame = Math.floor(currentTime * fps) % Math.floor(duration * fps);
            const totalFramesCount = Math.floor(duration * fps);
            
            setCurrentFrame(frame);
            setTotalFrames(totalFramesCount);
          }
        }
      }
      
      // 更新性能统计
      if (statsRef.current) {
        statsRef.current.update();
        
        // 每秒更新一次模型信息
        const now = Date.now();
        if (now - lastInfoUpdate > 1000) {
          lastInfoUpdate = now;
          updateModelInfo();
        }
      }
      
      // 渲染场景
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    let lastInfoUpdate = Date.now();
    
    // 更新模型信息
    const updateModelInfo = () => {
      if (!sceneRef.current) return;
      
      let vertices = 0;
      let faces = 0;
      let bones = 0;
      
      sceneRef.current.traverse((object) => {
        if (object.isMesh) {
          if (object.geometry) {
            if (object.geometry.attributes.position) {
              vertices += object.geometry.attributes.position.count;
            }
            if (object.geometry.index) {
              faces += object.geometry.index.count / 3;
            } else if (object.geometry.attributes.position) {
              faces += object.geometry.attributes.position.count / 3;
            }
          }
        }
        if (object.isBone) {
          bones++;
        }
      });
      
      // 使用性能API获取内存使用情况
      let memoryUsage = 0;
      if (window.performance && window.performance.memory) {
        memoryUsage = Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024));
      }
      
      setModelInfo(prev => ({
        ...prev,
        vertices,
        faces,
        bones,
        frameTime: Math.round(statsRef.current.renderTime),
        memoryUsage
      }));
    };
    
    animate();
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current) {
        if (rendererRef.current && rendererRef.current.domElement) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
        if (statsRef.current && statsRef.current.dom) {
          containerRef.current.removeChild(statsRef.current.dom);
        }
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (resourceTrackerRef.current) {
        resourceTrackerRef.current.dispose();
      }
    };
  }, [bgColor]); // 仅在bgColor变化时重新创建场景

  // 加载模型
  useEffect(() => {
    if (!sceneRef.current || !modelUrl) return;
    
    setIsLoading(true);
    setLoadingProgress(0);
    
    // 清理之前的模型
    sceneRef.current.traverse((child) => {
      if (child.userData && child.userData.isImported) {
        if (child.parent) {
          child.parent.remove(child);
        }
      }
    });
    
    if (mixerRef.current) {
      mixerRef.current = null;
    }
    
    animationActionsRef.current = [];
    
    const loadModel = () => {
      const fileExt = modelUrl.split('.').pop().toLowerCase();
      
      const onProgress = (xhr) => {
        if (xhr.lengthComputable) {
          const progress = xhr.loaded / xhr.total * 100;
          setLoadingProgress(progress);
        }
      };
      
      const onError = (error) => {
        console.error('模型加载失败:', error);
        setIsLoading(false);
      };
      
      // 根据文件扩展名选择加载器
      if (fileExt === 'glb' || fileExt === 'gltf') {
        const loader = new GLTFLoader();
        
        loader.load(
          modelUrl,
          (gltf) => {
            const model = gltf.scene;
            model.userData.isImported = true;
            
            // 遍历模型，设置投影和接收阴影
            model.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            
            // 添加到场景
            sceneRef.current.add(model);
            
            // 设置合适的摄像机位置
            fitCameraToModel(model);
            
            // 处理动画
            if (gltf.animations && gltf.animations.length > 0) {
              const mixer = new THREE.AnimationMixer(model);
              mixerRef.current = mixer;
              
              gltf.animations.forEach((clip, index) => {
                const action = mixer.clipAction(clip);
                animationActionsRef.current.push(action);
                
                // 更新模型信息中的动画列表
                setModelInfo(prev => ({
                  ...prev,
                  animations: [
                    ...prev.animations,
                    {
                      name: clip.name || `动画 ${index + 1}`,
                      duration: clip.duration,
                      frames: Math.floor(clip.duration * 30) // 假设30fps
                    }
                  ]
                }));
              });
              
              // 播放初始动画
              if (animationActionsRef.current.length > 0 && currentAnimation < animationActionsRef.current.length) {
                animationActionsRef.current[currentAnimation].play();
              }
            }
            
            setIsLoading(false);
          },
          onProgress,
          onError
        );
      } else if (fileExt === 'fbx') {
        const loader = new FBXLoader();
        
        loader.load(
          modelUrl,
          (fbx) => {
            fbx.userData.isImported = true;
            
            // 遍历模型，设置投影和接收阴影
            fbx.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            
            // 添加到场景
            sceneRef.current.add(fbx);
            
            // 设置合适的摄像机位置
            fitCameraToModel(fbx);
            
            // 处理动画
            if (fbx.animations && fbx.animations.length > 0) {
              const mixer = new THREE.AnimationMixer(fbx);
              mixerRef.current = mixer;
              
              fbx.animations.forEach((clip, index) => {
                const action = mixer.clipAction(clip);
                animationActionsRef.current.push(action);
                
                // 更新模型信息中的动画列表
                setModelInfo(prev => ({
                  ...prev,
                  animations: [
                    ...prev.animations,
                    {
                      name: clip.name || `动画 ${index + 1}`,
                      duration: clip.duration,
                      frames: Math.floor(clip.duration * 30) // 假设30fps
                    }
                  ]
                }));
              });
              
              // 播放初始动画
              if (animationActionsRef.current.length > 0 && currentAnimation < animationActionsRef.current.length) {
                animationActionsRef.current[currentAnimation].play();
              }
            }
            
            setIsLoading(false);
          },
          onProgress,
          onError
        );
      }
    };
    
    // 设置摄像机以适应模型
    const fitCameraToModel = (model) => {
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());
      
      // 重置控制器目标点到模型中心
      if (controlsRef.current) {
        controlsRef.current.target.copy(center);
      }
      
      // 设置相机位置
      if (cameraRef.current) {
        const direction = new THREE.Vector3(1, 0.5, 1).normalize();
        const distance = size * 2;
        cameraRef.current.position.copy(center).add(direction.multiplyScalar(distance));
        cameraRef.current.lookAt(center);
        cameraRef.current.updateProjectionMatrix();
      }
    };
    
    loadModel();
  }, [modelUrl]);

  // 切换动画
  useEffect(() => {
    if (!mixerRef.current || animationActionsRef.current.length === 0) return;

    // 停止所有动画
    animationActionsRef.current.forEach(action => {
      action.stop();
    });

    // 播放当前选中的动画
    if (currentAnimation < animationActionsRef.current.length) {
      const action = animationActionsRef.current[currentAnimation];
      action.play();
    }
  }, [currentAnimation]);

  // 控制播放状态
  useEffect(() => {
    if (!mixerRef.current) return;

    if (isPlaying) {
      mixerRef.current.timeScale = playbackSpeed;
    } else {
      mixerRef.current.timeScale = 0;
    }
  }, [isPlaying, playbackSpeed]);

  // 控制网格显示
  useEffect(() => {
    if (!sceneRef.current) return;

    sceneRef.current.traverse((child) => {
      if (child.isGridHelper) {
        child.visible = showGrid;
      }
    });
  }, [showGrid]);

  // 控制坐标轴显示
  useEffect(() => {
    if (!sceneRef.current) return;

    sceneRef.current.traverse((child) => {
      if (child.isAxesHelper) {
        child.visible = showAxes;
      }
    });
  }, [showAxes]);

  // 处理辅助功能：截图
  const takeScreenshot = () => {
    if (!rendererRef.current) return;

    // 暂时隐藏UI元素
    const statsElement = statsRef.current?.dom;
    if (statsElement) {
      statsElement.style.display = 'none';
    }

    // 渲染一帧
    rendererRef.current.render(sceneRef.current, cameraRef.current);

    // 创建下载链接
    const link = document.createElement('a');
    link.href = rendererRef.current.domElement.toDataURL('image/png');
    link.download = 'model-screenshot.png';
    link.click();

    // 恢复UI元素
    if (statsElement) {
      statsElement.style.display = 'block';
    }
  };

  // 辅助功能：重置视角
  const resetCamera = () => {
    if (!controlsRef.current || !cameraRef.current) return;

    // 重置相机位置
    gsap.to(cameraRef.current.position, {
      x: 0,
      y: 1.5,
      z: 3,
      duration: 1,
      ease: 'power2.inOut'
    });

    // 重置控制器目标点
    gsap.to(controlsRef.current.target, {
      x: 0,
      y: 1,
      z: 0,
      duration: 1,
      ease: 'power2.inOut'
    });
  };

  // 切换背景颜色
  const toggleBackground = () => {
    const colors = ['#111111', '#333333', '#FFFFFF'];
    const currentIndex = colors.indexOf(bgColor);
    const nextIndex = (currentIndex + 1) % colors.length;
    setBgColor(colors[nextIndex]);
  };

  return (
    <div className="enhanced-model-viewer">
      {/* 3D渲染容器 */}
      <div 
        ref={containerRef} 
        className="model-viewer-container"
      />

      {/* 加载界面 */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-title">加载模型中...</div>
          <div className="loading-progress">
            <div 
              className="progress-bar" 
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* 控制面板 */}
      <div className="controls-panel panel">
        <div className="controls-group">
          <button 
            className="btn" 
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? '暂停' : '播放'}
          </button>
          
          <select 
            className="btn" 
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
          >
            <option value="0.25">0.25x</option>
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>

        <div className="controls-group">
          <button 
            className="btn" 
            onClick={() => setShowGrid(!showGrid)}
          >
            {showGrid ? '隐藏网格' : '显示网格'}
          </button>
          
          <button 
            className="btn" 
            onClick={() => setShowAxes(!showAxes)}
          >
            {showAxes ? '隐藏坐标轴' : '显示坐标轴'}
          </button>
        </div>

        <div className="controls-group">
          <button 
            className="btn" 
            onClick={toggleBackground}
          >
            切换背景
          </button>
          
          <button 
            className="btn" 
            onClick={resetCamera}
          >
            重置视角
          </button>
          
          <button 
            className="btn" 
            onClick={takeScreenshot}
          >
            截图
          </button>
        </div>
      </div>

      {/* 动画时间轴 */}
      <div className="timeline-panel panel">
        <div className="frame-info">
          {currentFrame} / {totalFrames} 帧
        </div>
        
        <input 
          type="range" 
          className="progress" 
          min="0" 
          max={totalFrames} 
          value={currentFrame}
          onChange={(e) => {
            if (!mixerRef.current || !animationActionsRef.current[currentAnimation]) return;
            
            const frame = parseInt(e.target.value);
            const action = animationActionsRef.current[currentAnimation];
            const clip = action.getClip();
            const time = (frame / totalFrames) * clip.duration;
            
            action.time = time;
            setCurrentFrame(frame);
          }}
        />
      </div>

      {/* 动画列表 */}
      {modelInfo.animations.length > 0 && (
        <div className="animations-panel panel">
          <h3>动画列表</h3>
          <div className="animations-list">
            {modelInfo.animations.map((anim, index) => (
              <div 
                key={index} 
                className={`animation-item ${currentAnimation === index ? 'active' : ''}`}
                onClick={() => setCurrentAnimation(index)}
              >
                <span>{anim.name || `动画 ${index + 1}`}</span>
                <span>{anim.duration.toFixed(1)}秒</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 信息面板 */}
      {infoMode !== 'none' && (
        <div className={`info-panel panel ${infoMode === 'sidebar' ? 'sidebar' : 'header'}`}>
          <div className="info-item">
            <span className="info-label">顶点:</span>
            <span className="info-value">{modelInfo.vertices.toLocaleString()}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">面片:</span>
            <span className="info-value">{modelInfo.faces.toLocaleString()}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">骨骼:</span>
            <span className="info-value">{modelInfo.bones}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">动画:</span>
            <span className="info-value">{modelInfo.animations.length}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">渲染时间:</span>
            <span className="info-value">{modelInfo.frameTime} ms</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">内存:</span>
            <span className="info-value">{modelInfo.memoryUsage} MB</span>
          </div>
        </div>
      )}

      {/* 信息面板切换按钮 */}
      <button 
        className="info-toggle btn" 
        onClick={() => {
          const modes = ['none', 'header', 'sidebar'];
          const currentIndex = modes.indexOf(infoMode);
          const nextIndex = (currentIndex + 1) % modes.length;
          setInfoMode(modes[nextIndex]);
        }}
      >
        i
      </button>
    </div>
  );
};

export default EnhancedModelViewer; 