ABOUTME: 200-word summary of the OSUniverse AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# OSUniverse

OSUniverse is a task-oriented desktop benchmark for vision-based GUI-navigation agents, introduced by Davydova et al. (AgentSea) in May 2025. It provides complex, multimodal desktop tasks across seven categories: desktop, browser, gym, terminal, LibreOffice Calc, LibreOffice Writer, and multi-app workflows. Tasks are organized into five difficulty levels (paper, wood, bronze, silver, gold) ranging from basic precision clicking to multistep, multi-application operations requiring agent dexterity and decision-making.

Evaluation supports both manual scoring and an automated validation system with an average error rate below 2%, enabling fully automated progress measurement. The benchmark is calibrated so that state-of-the-art agents achieve no higher than 50% success rates, while average office workers can complete all tasks perfectly. Tasks run inside Docker containers using the Surfkit agent framework, with configurable step limits per difficulty level and support for parallel execution across multiple runners.

OSUniverse is significant for its emphasis on ease of use, extensibility, and comprehensive coverage of desktop GUI interactions. It supports multiple agent frameworks including OpenAI Computer Use Preview, Claude 3.5 Sonnet, Qwen 2.5 VL, and GPT-4o through a flexible runner architecture. The benchmark is open source under the MIT license with a Streamlit-based results viewer.
