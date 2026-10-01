import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function Scene() {
    // 1) canvas를 넣을 div를 가리킬 ref
    const mountRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const mount = mountRef.current
        if (!mount) return

        const width = mount.clientWidth
        const height = mount.clientHeight

        // 2) TODO: Scene 만들기
           const scene = new THREE.Scene()

        // 3) TODO: Camera 만들기
        //    new THREE.PerspectiveCamera(시야각, 가로/세로 비율, 가까운 한계, 먼 한계)
        //    예: (75, width / height, 0.1, 1000)
            const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)

        // 4) TODO: Renderer 만들기
           const renderer = new THREE.WebGLRenderer()
           renderer.setSize(width, height)

        // 5) TODO: renderer.domElement(canvas)를 mount에 붙이기
           mount.appendChild(renderer.domElement)

        // 1) TODO: Geometry 만들기 (가로, 세로, 깊이 순서)
           const geometry = new THREE.BoxGeometry(1, 1, 1)

        // 2) TODO: Material 만들기 (색은 16진수)
           const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })

        // 3) TODO: Mesh 만들기 (모양 + 재질)
           const cube = new THREE.Mesh(geometry, material)

        // 4) TODO: Scene에 올리기
           scene.add(cube)

        // 5) TODO: 카메라를 뒤로 물리기 (z축 방향)
           camera.position.z = 5

        // 6) TODO: renderer.render(scene, camera) 한 번 호출
            renderer.render(scene, camera)

        // 7) cleanup: 컴포넌트가 사라질 때 정리
        return () => {
            // TODO: mount.removeChild(renderer.domElement)
            // TODO: renderer.dispose()
            mount.removeChild(renderer.domElement)
            renderer.dispose()
            geometry.dispose()
            material.dispose()
        }
    }, [])

    return <div ref={mountRef} className="h-screen w-full" />
}

export default Scene