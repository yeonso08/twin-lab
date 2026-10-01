# Three.js 스터디 일지

React + Vite + TypeScript + Tailwind 환경에서 순수 Three.js를 학습하며 기록한다.
(필요해지면 React Three Fiber 도입을 검토)

## 진행 방식

- 단계마다 개념 설명 → import 포함 뼈대 코드(TODO) 제공 → 직접 작성 → 피드백
- 설명만 하고 끝내지 않고 반드시 예시/틀을 함께 제공한다 (처음이라 어떤 클래스를 import하는지 모르기 때문)
- 단계가 끝날 때마다 이 일지에 기록한다

## 학습 로드맵

- [x] 1. 기본 3요소: Scene, Camera, Renderer로 빈 화면 띄우기
- [x] 2. Mesh = Geometry + Material, 큐브 하나 그리기
- [x] 3. 렌더 루프(`requestAnimationFrame`)로 회전 애니메이션
- [x] 4. React 컴포넌트에 붙이기 (`useRef` + `useEffect`, cleanup/dispose)
- [x] 5. 조명 (Ambient, Directional)과 Material 종류
- [x] 6. 카메라 종류, 리사이즈 대응, OrbitControls
- [x] 7. 좌표계, Transform(position, rotation, scale), Group
- [ ] 8. 텍스처 / glTF 모델 로딩
- [ ] 9. 그림자, 레이캐스팅(클릭 상호작용)
- [ ] 10. twin-lab에 적용할 실제 장면 만들기

## 진행 기록

### 2026-10-01
- Vite + React + TS 프로젝트 초기 세팅, 데모 파일 정리
- Tailwind 설정
- three, @types/three 설치
- 1단계 시작: Scene / Camera / Renderer 개념 학습
  - Scene = 무대, PerspectiveCamera = 시점, WebGLRenderer = canvas에 그려 주는 도구
  - `renderer.render(scene, camera)`로 한 번 그린다
  - 작업 파일: `src/components/Scene.tsx` (`useRef` + `useEffect`, cleanup에서 `dispose`)
  - 상태: 완료 (검은 화면 확인). 개념은 아직 완전히 이해하지 못해 개념 메모에 정리해 두고 반복해서 복습
- 2단계 완료: BoxGeometry + MeshBasicMaterial로 초록 큐브 렌더링, 카메라 z=5
- 3단계 완료: requestAnimationFrame 렌더 루프로 큐브 회전, cleanup에서 cancelAnimationFrame
  - 프레임(브라우저 화면 갱신 주기)과 React 재렌더링은 별개라는 점을 이해함
- 5단계 완료: MeshStandardMaterial + AmbientLight + DirectionalLight로 입체감 확인
- 6단계 완료: 리사이즈 대응(handleResize) + OrbitControls
- 7단계 완료: 큐브 3개를 Group으로 묶어 배치/크기 조절, 그룹 통째로 회전
  - 실수 기록: `group.rotation.y += 0.01`을 animate 밖에 써서 한 번만 실행됨. 반복돼야 하는 변경은 animate 안에 써야 한다
- 다음: 로드맵 8단계 (텍스처 / glTF 모델 로딩)

## 개념 메모

### 2단계: Mesh = Geometry + Material

- **Mesh**: Scene에 올리는 물체. Geometry(모양) + Material(재질)
- `BoxGeometry(1, 1, 1)`: 가로/세로/깊이. `MeshBasicMaterial({ color })`: 조명 영향 없는 단색
- `scene.add(cube)`로 무대에 올린다
- 물체와 카메라는 기본 좌표가 둘 다 (0, 0, 0)이라 `camera.position.z = 5`로 카메라를 뒤로 물려야 보인다
- cleanup에서 `geometry.dispose()`, `material.dispose()`도 호출

### 7단계: 좌표계, Transform, Group

- 좌표: x(오른쪽 +), y(위 +), z(나 쪽 +). 원점 (0, 0, 0)은 화면 중앙
- **Transform** 3가지: `position`(위치), `rotation`(라디안, 180도 = `Math.PI`), `scale`(크기 배율). Mesh, Group, Light 모두 가진다
- **Group**: 여러 물체를 묶는 빈 상자. `group.add(a, b, c)` 후 `scene.add(group)`. 그룹을 움직이면 자식이 같이 움직이고, 자식의 위치는 그룹 기준(로컬 좌표)
- 그룹 회전은 자식의 위치까지 같이 돌려서 원점을 중심으로 공전하는 것처럼 보인다
- geometry/material은 여러 Mesh가 공유할 수 있다. 여러 개를 만들었다면 각각 dispose 필요

### 6단계: 리사이즈와 OrbitControls

- `clientWidth`는 읽는 순간의 숫자만 복사한다. div는 브라우저가 알아서 바뀌지만 canvas/카메라는 Three.js 객체라 직접 알려 줘야 한다
- 리사이즈 3줄: `camera.aspect = w / h` → `camera.updateProjectionMatrix()`(적용) → `renderer.setSize(w, h)`
- `window.addEventListener('resize', handleResize)`로 이벤트를 등록해야 handleResize가 실행된다
- **OrbitControls**: `import { OrbitControls } from 'three/addons/controls/OrbitControls.js'`. 드래그=회전, 휠=확대/축소, 우클릭 드래그=이동
  - `new OrbitControls(camera, renderer.domElement)`, `enableDamping = true`를 켜면 animate에서 `controls.update()` 필요
  - cleanup에서 `controls.dispose()`
- 실수 기록: `addEventListener`를 handleResize 함수 **안**에 넣어서 리스너가 등록되지 않았다. 등록은 함수 밖에서 해야 한다

### 5단계: 조명과 Material

- `MeshBasicMaterial`은 조명 무시(항상 단색), `MeshStandardMaterial`은 조명을 받음. 조명이 없으면 검게 보인다
- **AmbientLight**(색, 세기): 방 전체를 은은하게 밝힘. 방향 없음, 입체감은 없음
- **DirectionalLight**(색, 세기): 태양 같은 평행광. `position.set(x, y, z)`로 방향을 정하고 면마다 밝기가 달라져 입체감이 생김
- 보통 둘을 같이 쓴다 (Ambient로 어두운 면이 완전히 검어지는 것 방지)
- `roughness`(거칠기), `metalness`(금속성)로 재질 느낌 조절
- 조명은 `dispose()` 불필요

### 3단계: 렌더 루프

- 지금까지는 `render()` 한 번 = 정지된 사진 한 장. 움직이려면 "조금 변경 → 다시 그리기"를 반복해야 한다
- **requestAnimationFrame(fn)**: 브라우저가 다음 화면을 그리기 직전에 fn을 **한 번** 실행하도록 예약. 반복이 아니라 1회 예약이라서 fn 안에서 자기 자신을 다시 예약해야 루프가 된다
- setInterval보다 좋은 이유: 모니터 주사율에 맞춰 실행(부드러움), 탭이 안 보이면 자동 중단
- 반환값(id)을 `frameId`에 저장하고, cleanup에서 `cancelAnimationFrame(frameId)`로 루프를 멈춘다
- **프레임 ≠ React 재렌더링**: 프레임은 브라우저가 화면을 한 장 그리는 주기(60Hz면 초당 60번). animate는 React 바깥에서 돌고, `cube.rotation`을 직접 수정하므로 state/재렌더링이 일어나지 않는다. state로 돌리면 매 프레임 재렌더링되어 성능이 나빠진다
- 회전: `cube.rotation.x += 0.01` (단위는 라디안)

### 1단계: Scene / Camera / Renderer

### 1단계: Scene / Camera / Renderer

- **canvas**: HTML의 "그림 그리는 도화지" 태그. 3D 그래픽은 여기에 그린다
- **Renderer**: Scene을 Camera 시점에서 계산해 2D 이미지로 canvas에 그리는 화가. `new THREE.WebGLRenderer()`를 만들면 canvas가 `renderer.domElement`에 생긴다
- **useRef**: 특정 HTML 요소(div)를 React에서 붙잡는 손잡이. `<div ref={mountRef} />`로 연결하고, 렌더 후 `mountRef.current`에 실제 div가 들어온다 (처음엔 null)
- **useEffect**: 화면에 그려진 뒤 실행된다. div가 존재하는 시점에 canvas를 붙이려고 쓴다. `[]`는 처음 한 번만 실행
- **clientWidth/clientHeight**: div의 현재 픽셀 크기. canvas와 카메라 비율을 맞추려고 읽는다
- **PerspectiveCamera(75, width / height, 0.1, 1000)**: 시야각 75도, 화면 비율, 가까운 한계 0.1, 먼 한계 1000. 처음엔 이 값 그대로 쓴다
- **appendChild**: renderer의 canvas를 div 안에 넣어 화면에 보이게 한다
- **cleanup(return)**: 컴포넌트가 사라질 때 canvas 제거 + `renderer.dispose()`로 GPU 메모리 해제
- 흐름: div 생성 → useEffect → 크기 읽기 → Scene/Camera/Renderer 생성 → canvas 붙이기 → render → (언마운트 시) 정리

## 막혔던 점 / 해결

(에러와 해결 방법을 기록한다)
