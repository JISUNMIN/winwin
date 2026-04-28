# session-end-summary

사용자가 "세션종료", "세션 종료", "종료해줘", "오늘 여기까지"라고 말하면 다음을 수행한다.

1. 현재 작업 상태를 요약한다.
2. 수정한 파일, 남은 작업, 주의사항을 정리한다.
3. 다음 세션에서 이어가기 좋은 형태로 출력한다.
4. 가능하면 Codex의 `session-end-summary` 기능을 사용한다.
5. 프로젝트 안에 `codex/SESSION_END_SUMMARY.md`가 있거나 만들 수 있으면 업데이트한다.

우선 확인할 파일:

- `codex/SESSION_END_SUMMARY.md`
- `codex/progress-and-next-steps.md`
- `codex/README.md`
- `code/**/*.md`
- `package.json`
- `git status --short`

출력 형식:

```md
## 현재 상태

## 완료한 작업

## 변경된 파일

## 남은 작업

## 다음 세션 시작 프롬프트
```
