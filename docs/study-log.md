# Three.js 스터디 일지

React + Vite + TypeScript + Tailwind 환경에서 순수 Three.js를 학습하며 기록한다.
(필요해지면 React Three Fiber 도입을 검토)

## 진행 방식

- 단계마다 개념 설명 → import 포함 뼈대 코드(TODO) 제공 → 직접 작성 → 피드백
- 설명만 하고 끝내지 않고 반드시 예시/틀을 함께 제공한다 (처음이라 어떤 클래스를 import하는지 모르기 때문)
- 단계가 끝날 때마다 이 일지에 기록한다

## 학습 로드맵

- [ ] 1. 기본 3요소: Scene, Camera, Renderer로 빈 화면 띄우기
- [ ] 2. Mesh = Geometry + Material, 큐브 하나 그리기
- [ ] 3. 렌더 루프(`requestAnimationFrame`)로 회전 애니메이션
- [ ] 4. React 컴포넌트에 붙이기 (`useRef` + `useEffect`, cleanup/dispose)
- [ ] 5. 조명 (Ambient, Directional)과 Material 종류
- [ ] 6. 카메라 종류, 리사이즈 대응, OrbitControls
- [ ] 7. 좌표계, Transform(position, rotation, scale), Group
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

## 개념 메모

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
