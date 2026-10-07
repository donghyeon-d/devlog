---
title: "WSL 자동 종료 방지하기"
description: "WSL2 가 일정 시간 후 자동으로 종료되어 백그라운드 서비스가 멈추는 문제를 .wslconfig 와 systemd 설정으로 해결합니다."
date: 2026-09-02
category: "Linux"
tags:
  - Linux
  - WSL
  - Bash
---

WSL2 에서 개발 서버나 DB 를 띄워 두었는데, 터미널을 닫고 잠시 뒤에 돌아오면 프로세스가 모두 종료되어 있는 경우가 있습니다. WSL 은 **실행 중인 터미널이 없으면 일정 시간 뒤 VM 을 종료**하기 때문입니다.

## 원인

WSL2 는 가벼운 VM 위에서 동작합니다. 마지막 WSL 프로세스가 끝나면 기본적으로 약 **60초 뒤** 배포판이 종료되고, 모든 배포판이 종료되면 VM 도 내려갑니다.

현재 상태는 PowerShell 에서 확인할 수 있습니다.

```powershell
wsl --list --verbose
```

```text
  NAME            STATE           VERSION
* Ubuntu-24.04    Running         2
```

## 해결 방법

### 1. .wslconfig 에서 vmIdleTimeout 설정

Windows 사용자 폴더(`%UserProfile%\.wslconfig`)에 다음 설정을 추가합니다.

```ini
[wsl2]
# VM 이 유휴 상태여도 종료하지 않음 (단위: ms, -1 = 무제한)
vmIdleTimeout=-1
```

> [!TIP]
> 설정을 바꾼 뒤에는 `wsl --shutdown` 으로 VM 을 완전히 내렸다가 다시 시작해야 적용됩니다.

### 2. systemd 서비스로 유지하기

배포판 자체가 종료되지 않게 하려면 systemd 를 켜고 서비스를 등록합니다. 먼저 `/etc/wsl.conf` 에 다음을 추가합니다.

```ini
[boot]
systemd=true
```

그리고 간단한 keep-alive 서비스를 만듭니다.

```bash
sudo tee /etc/systemd/system/keep-alive.service > /dev/null <<'UNIT'
[Unit]
Description=Keep WSL distro alive

[Service]
ExecStart=/bin/sleep infinity
Restart=always

[Install]
WantedBy=multi-user.target
UNIT

sudo systemctl daemon-reload
sudo systemctl enable --now keep-alive.service
```

상태를 확인합니다.

```bash
systemctl status keep-alive.service --no-pager
```

### 3. Windows 시작 시 자동 실행

작업 스케줄러에 다음 명령을 등록하면 로그인할 때 WSL 이 백그라운드로 시작됩니다.

```powershell
wsl.exe -d Ubuntu-24.04 --exec /bin/true
```

## 방법 비교

| 방법 | 장점 | 단점 |
|---|---|---|
| `vmIdleTimeout` | 설정 한 줄 | VM 만 유지, 배포판은 종료될 수 있음 |
| systemd 서비스 | 배포판까지 유지 | systemd 활성화 필요 |
| 작업 스케줄러 | 재부팅 후에도 자동 시작 | Windows 설정 필요 |

> [!CAUTION]
> VM 을 계속 유지하면 WSL 이 사용하는 메모리도 반환되지 않습니다. 메모리가 부족하다면 `.wslconfig` 의 `memory=` 옵션으로 상한을 지정하세요.

## 정리

- 터미널을 닫아도 서비스가 유지되어야 한다면 **systemd 서비스 + `vmIdleTimeout`** 조합이 가장 확실합니다.
- 설정 후에는 반드시 `wsl --shutdown` 으로 재시작합니다.

자세한 옵션은 [WSL 공식 문서의 고급 설정](https://learn.microsoft.com/windows/wsl/wsl-config)을 참고하세요.
