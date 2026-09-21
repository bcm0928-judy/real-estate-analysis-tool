# 인근 실거래 분석

사업지 주소와 반경을 기준으로 아파트·오피스텔 실거래 및 분양 정보를 조회하는 단일 페이지 도구입니다.

## 바로 사용하기

개발이나 설치 없이 아래 주소를 열면 됩니다.

https://real-estate-analysis-tool-amber.vercel.app/

주소를 검색하고 조회 기간과 반경을 정한 뒤 **분석 시작**을 누르면 됩니다. 공공데이터 인증키는 Vercel에 안전하게 보관되어 있으므로 사용자가 따로 입력할 필요가 없습니다.

## 처음 공동 작업하는 분께

이 저장소는 웹페이지의 원본을 함께 보관하는 공간입니다. 초대를 수락했다고 바로 공개 페이지가 바뀌지는 않으니 안심하고 아래 순서대로 작업하면 됩니다.

1. Judy가 보낸 GitHub 공동 작업 초대를 수락합니다.
2. GitHub Desktop에서 이 저장소를 내려받습니다. 저장소 주소는 `https://github.com/bcm0928-judy/real-estate-analysis-tool`입니다.
3. `main`은 공개 중인 최종본이므로 직접 수정하지 않고, GitHub Desktop의 **Current branch > New branch**에서 자기 작업용 브랜치를 만듭니다. 이름은 `이름-수정내용`처럼 정하면 됩니다.
4. Claude나 다른 편집 도구에 내려받은 폴더를 열고 수정합니다. 화면과 동작 대부분은 `index.html`에 있습니다.
5. GitHub Desktop에서 변경 내용을 확인하고 **Commit**, **Push origin**을 차례로 누릅니다. Commit은 작업 내용을 저장하는 기록이고, Push는 그 기록을 GitHub에 올리는 동작입니다.
6. GitHub 저장소에 나타나는 **Compare & pull request**를 눌러 PR을 만듭니다. PR은 “내 수정본을 최종본에 합쳐주세요”라는 검토 요청입니다.
7. Judy가 내용을 확인해 Merge하면 `main`에 합쳐지고, Vercel이 공개 페이지를 자동으로 다시 배포합니다.

API 키나 비밀번호는 HTML, 채팅, GitHub에 직접 넣지 않습니다. 키 변경이 필요하면 저장소가 아니라 Vercel의 `DATA_SERVICE_KEY` 환경변수를 수정합니다.

## 파일 안내

| 파일 | 역할 |
| --- | --- |
| `index.html` | 화면 디자인과 실거래 분석 동작 |
| `api/public-data.js` | Vercel에서 공공데이터 API를 대신 호출해 키를 숨기는 함수 |
| `vercel.json` | API 실행 위치를 서울로 지정하고 최대 실행 시간을 설정 |
| `.gitignore` | 실제 키가 들어가는 환경변수 파일이 GitHub에 올라가지 않도록 차단 |
| `.env.example` | 필요한 환경변수 이름만 보여주는 예시 파일 |

## 사용 전 설정

1. Kakao Developers의 **앱 > 플랫폼 키 > JavaScript 키 > JavaScript SDK 도메인**에 배포 도메인을 등록합니다.
2. Vercel 프로젝트의 `DATA_SERVICE_KEY` 비밀 환경변수에 공공데이터포털에서 발급받은 일반 인증키(Decoding)를 등록합니다.
3. 페이지에서 주소를 검색한 뒤 **분석 시작**을 누릅니다.

API 인증키는 저장소나 브라우저에 포함되지 않으며 Vercel 서버리스 함수에서만 사용됩니다.

## 로컬 실행

```powershell
py -m http.server 8080
```

브라우저에서 `http://localhost:8080`을 엽니다. `file://` 방식으로는 지도 SDK가 정상 작동하지 않습니다.

Vercel 배포 전 로컬에서 API까지 확인하려면 Vercel CLI를 사용하고 `.env.local`에 키를 설정합니다. `.env.local`은 커밋하지 않습니다.
