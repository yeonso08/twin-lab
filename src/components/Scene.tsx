import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

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

        // 리사이즈 함수
        const handleResize = () => {
            const w = mount.clientWidth
            const h = mount.clientHeight

            // TODO: 카메라 비율 갱신
                  camera.aspect = w / h
            // TODO: 카메라에 반영
                  camera.updateProjectionMatrix()
            // TODO: canvas 크기 갱신
                  renderer.setSize(w, h)
        }

        // TODO: 창 크기가 바뀔 때 handleResize 실행
        window.addEventListener('resize', handleResize)

        // 4) TODO: Renderer 만들기
           const renderer = new THREE.WebGLRenderer()
           renderer.setSize(width, height)

        // TODO: OrbitControls 만들기 (조작할 카메라, 마우스 이벤트를 받을 요소)
        const controls = new OrbitControls(camera, renderer.domElement)

        // TODO: 부드럽게 멈추는 관성 효과 켜기
        controls.enableDamping = true

        // 5) TODO: renderer.domElement(canvas)를 mount에 붙이기
           mount.appendChild(renderer.domElement)

        // 1) TODO: Geometry 만들기 (가로, 세로, 깊이 순서)
           const geometry = new THREE.BoxGeometry(1, 1, 1)

        // 2) TODO: Material 만들기 (색은 16진수)
        //    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })

        // 1) TODO: Material 교체 (MeshBasicMaterial → MeshStandardMaterial)
           const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0.2, metalness: 0.1  })

        // 2) TODO: 은은한 전체 조명 (색, 세기)
           const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
           scene.add(ambientLight)

        // 3) TODO: 태양 같은 방향 조명 (색, 세기)
           const directionalLight = new THREE.DirectionalLight(0xffffff, 10)

        // 4) TODO: 조명 위치 정하기 (오른쪽 위 앞에서 비추기)
           directionalLight.position.set(3, 3, 5)

        // 5) TODO: Scene에 올리기
           scene.add(directionalLight)

        // // 3) TODO: Mesh 만들기 (모양 + 재질)
        //    const cube = new THREE.Mesh(geometry, material)
        //
        // // 4) TODO: Scene에 올리기
        //    scene.add(cube)

        // 1) 큐브 3개를 담을 그룹 만들기
        const group = new THREE.Group()

        // 2) TODO: 큐브 3개를 만들어 그룹에 넣기
        //    같은 geometry는 재사용하고, material은 색만 다르게 만들면 됩니다.
        //    (geometry/material은 이미 만든 것을 재사용해도 되고, 색별로 새로 만들어도 됩니다)
        //
           const cubeA = new THREE.Mesh(geometry, material)
           const cubeB = new THREE.Mesh(geometry, material)
           const cubeC = new THREE.Mesh(geometry, material)
        //
           group.add(cubeA, cubeB, cubeC)

        // 3) TODO: 세 큐브의 위치를 x축으로 나란히 배치
           cubeA.position.set(-2, 0, 0)
           cubeB.position.set(0, 0, 0)
           cubeC.position.set(2, 0, 0)

        // 4) TODO: 가운데 큐브만 크기를 1.5배로
           cubeB.scale.set(1.5, 1.5, 1.5)

        // 5) TODO: 그룹을 scene에 올리기
           scene.add(group)

        // 5) TODO: 카메라를 뒤로 물리기 (z축 방향)
           camera.position.z = 5

        // 6) TODO: renderer.render(scene, camera) 한 번 호출
        //     renderer.render(scene, camera)

        // 1) 애니메이션 id를 저장할 변수 (나중에 멈추려고)
        let frameId = 0

        // 2) 렌더 루프 함수
        const animate = () => {
            // TODO: controls.update()
            controls.update()

            // TODO: 다음 프레임에 animate를 다시 실행하도록 예약하고, 반환값을 frameId에 저장
                  frameId = requestAnimationFrame(animate)

            // TODO: cube를 회전시키기
            //       cube.rotation.x += 0.01
            //       cube.rotation.y += 0.01
            //       cube.rotation.z += 0.01

            group.rotation.y += 0.01   // ← 106번째 줄을 지우고 여기로 옮기기

            // TODO: 그리기
                  renderer.render(scene, camera)
        }

        // 3) TODO: 루프 시작 (animate 한 번 호출)
           animate()

        // 7) cleanup: 컴포넌트가 사라질 때 정리
        return () => {
            // TODO: mount.removeChild(renderer.domElement)
            // TODO: renderer.dispose()
            // TODO: cancelAnimationFrame(frameId)
            // TODO: window.removeEventListener('resize', handleResize)
            // TODO: controls.dispose()
            cancelAnimationFrame(frameId)
            mount.removeChild(renderer.domElement)
            renderer.dispose()
            geometry.dispose()
            material.dispose()
            controls.dispose()
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return <div ref={mountRef} className="h-screen w-full" />
}

export default Scene