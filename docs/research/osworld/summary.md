ABOUTME: 200-word summary of the OSWorld AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# OSWorld

OSWorld is the first scalable, real computer environment for multimodal agents, introduced by Xie et al. (XLANG Lab) in April 2024. It supports task setup, execution-based evaluation, and interactive learning across Ubuntu, Windows, and macOS. The benchmark contains 369 computer tasks involving real web and desktop applications, OS file I/O, and multi-application workflows. Each task includes a detailed initial state configuration and a custom execution-based evaluation script for reproducible assessment. An updated OSWorld-Verified version was released in July 2025 with community-driven fixes and AWS parallelization support.

Evaluation is execution-based, checking whether the agent achieved the correct end state via programmatic validators. Humans accomplish over 72.36% of tasks, while the best model achieves only 12.24% success rate, primarily struggling with GUI grounding and operational knowledge. The environment supports screenshot, accessibility tree, and other observation modes, with agents interacting through pyautogui actions.

OSWorld has become a foundational benchmark for desktop agent research, serving as the basis for Windows Agent Arena and inspiring similar platforms. It supports VMware, VirtualBox, Docker, and AWS deployment. The codebase is open source under Apache 2.0, with an active leaderboard and verified evaluation track.
