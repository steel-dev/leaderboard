ABOUTME: 200-word summary of the Mobile-Env AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# Mobile-Env

Mobile-Env is a comprehensive toolkit for building GUI interaction benchmarks on Android, developed by Zhang et al. (SJTU X-LANCE Lab) and published in May 2023. Built on top of DeepMind's AndroidEnv, it provides an isolated and controllable platform where agents interact via screenshots and view hierarchies, taking touch or text-typing actions. The platform supports intermediate instructions and rewards at crucial steps, reflecting real-world usage patterns more naturally than simple pass/fail evaluation.

Evaluation uses event-driven reward signals parsed from multiple sources: screen text, screen icons, view hierarchy, and system logs. The platform ships with a WikiHow task set available on HuggingFace that captures dynamic online content for fully controllable and reproducible evaluation, plus an open-world task set across various real-world apps. Even advanced models like GPT-4V and LLaMA-3 struggle with tasks that are relatively simple for humans, highlighting significant gaps in current GUI agent capabilities.

Mobile-Env is significant as a foundational platform for Android GUI agent research, emphasizing extensibility and benchmark quality. New tasks can be added through task definition files without code changes, and template tools support auto-generating multi-step task definitions. Docker images are available for simplified deployment. The platform is open source and supports both visual-based and text-based agents.
