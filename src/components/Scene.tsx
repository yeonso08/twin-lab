import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

function Scene() {
    // canvas를 붙일 div
    const mountRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const mount = mountRef.current
        if (!mount) return

        const width = mount.clientWidth
        const height = mount.clientHeight

        // Scene / Camera / Renderer
        const scene = new THREE.Scene()

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
        camera.position.z = 5

        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(width, height)
        mount.appendChild(renderer.domElement)

        // 마우스 조작 (드래그: 회전, 휠: 확대/축소)
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true

        // 조명
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 10)
        directionalLight.position.set(3, 3, 5)
        scene.add(ambientLight, directionalLight)

        // 재질 / 텍스처
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            roughness: 0.2,
            metalness: 0.1,
        })

        const texture = new THREE.TextureLoader().load('/textures/test.png')
        texture.colorSpace = THREE.SRGBColorSpace
        const texturedMaterial = new THREE.MeshStandardMaterial({ map: texture })

        // 큐브 3개를 그룹으로 묶어 배치 (가운데는 텍스처 + 1.5배)
        const cubeA = new THREE.Mesh(geometry, material)
        const cubeB = new THREE.Mesh(geometry, texturedMaterial)
        const cubeC = new THREE.Mesh(geometry, material)

        cubeA.position.set(-2, 0, 0)
        cubeC.position.set(2, 0, 0)
        cubeB.scale.set(1.5, 1.5, 1.5)

        const group = new THREE.Group()
        group.add(cubeA, cubeB, cubeC)
        scene.add(group)

        // glTF 모델 로딩 (로드가 끝나면 콜백 실행)
        const loader = new GLTFLoader()
        loader.load('/models/house.gltf', (gltf) => {
            console.log(gltf)

            // gltf.scene이 불러온 모델 전체(Group)
            const house = gltf.scene
            house.position.set(0, -1.5, -3)
            scene.add(house)
        })

        // 창 크기 변경 대응
        const handleResize = () => {
            const w = mount.clientWidth
            const h = mount.clientHeight

            camera.aspect = w / h
            camera.updateProjectionMatrix()
            renderer.setSize(w, h)
        }
        window.addEventListener('resize', handleResize)

        // 렌더 루프
        let frameId = 0
        const animate = () => {
            frameId = requestAnimationFrame(animate)

            group.rotation.y += 0.01
            controls.update()
            renderer.render(scene, camera)
        }
        animate()

        // 정리
        return () => {
            cancelAnimationFrame(frameId)
            window.removeEventListener('resize', handleResize)
            mount.removeChild(renderer.domElement)

            controls.dispose()
            renderer.dispose()
            geometry.dispose()
            material.dispose()
            texture.dispose()
            texturedMaterial.dispose()
        }
    }, [])

    return <div ref={mountRef} className="h-screen w-full" />
}

export default Scene
