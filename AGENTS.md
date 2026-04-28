# Project Agent Instructions

이 프로젝트에서는 `code/skills` 아래의 md 파일을 작업 스킬처럼 사용한다.

## Trigger Rules

- 사용자가 "세션종료", "세션 종료", "종료해줘", "오늘 여기까지"라고 말하면 `code/skills/session-end-summary.md`를 따른다.
- 사용자가 "다음작업진행해줘", "다음 작업 진행해줘", "다음꺼 진행하자", "이어가자"라고 말하면 `code/skills/continue-next-task.md`를 따른다.

## Working Notes

- 기존 작업 기록은 `codex/` 폴더에 있다.
- 다음 작업을 시작할 때는 `codex/SESSION_END_SUMMARY.md`, `codex/progress-and-next-steps.md`, `codex/README.md`를 먼저 확인한다.
- 실제 기능 작업을 했거나 중요한 개념을 정리했으면 `codex/` 아래에 md 문서를 추가하거나 업데이트한다.
- 단순 질문 답변만 한 경우에는 md 문서를 만들지 않아도 된다.
