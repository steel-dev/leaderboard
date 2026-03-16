ABOUTME: 200-word summary of the AndroidWorld AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# AndroidWorld

AndroidWorld is a dynamic benchmarking environment for autonomous agents on Android, introduced by Rawles et al. (Google Research) in May 2024. It runs on a live Android emulator and contains 116 hand-crafted tasks across 20 real-world Android apps. Unlike static benchmarks, tasks are dynamically instantiated with randomly generated parameters, creating millions of unique task variations for robust evaluation. The environment also integrates MiniWoB++ web-based tasks rendered as native Android UI widgets.

Evaluation uses durable programmatic reward signals that inspect device system state. Each task includes dedicated initialization, success-checking, and tear-down logic for full reproducibility. Step limits are set to approximately 2x the human average completion time. The best agent (M3A with GPT-4) achieves 30.6% task completion, leaving substantial room for improvement. The benchmark supports experimental Docker deployment and has a lightweight footprint of 2 GB memory and 8 GB disk.

AndroidWorld is significant for its dynamic task instantiation, which prevents overfitting to fixed test sets and provides more realistic evaluation. Robustness analysis shows that task parameter variations significantly affect agent performance, demonstrating that static benchmarks may overestimate capabilities. The environment is open source, maintains a public leaderboard, and supports custom agent integration through a simple step-based interface.
