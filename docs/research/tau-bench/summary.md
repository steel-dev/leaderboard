ABOUTME: 200-word summary of the tau-bench AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# tau-bench

tau-bench is a benchmark for evaluating tool-agent-user interaction in real-world domains, proposed by Shunyu Yao, Noah Shinn, Pedram Razavi, and Karthik Narasimhan at Sierra Research in June 2024. It emulates dynamic multi-turn conversations between a simulated user (powered by language models) and a language agent equipped with domain-specific API tools and policy guidelines. The benchmark includes two domains: airline and retail, each with realistic customer service scenarios requiring the agent to follow complex rules while manipulating backend databases.

Evaluation uses an efficient state-based approach that compares the database state at conversation end with annotated goal states. The benchmark introduces the pass^k metric, measuring reliability across k independent trials. On the airline domain, Claude 3.5 Sonnet achieves the best pass^1 of 0.460, dropping to 0.225 at pass^4. On retail, the same model scores 0.692 at pass^1 and 0.462 at pass^4. Even GPT-4o achieves less than 50% on airline tasks, and consistency degrades significantly across repeated trials (pass^8 below 25% in retail).

tau-bench is notable for testing both user interaction quality and rule-following ability, two capabilities critical for real-world agent deployment that most benchmarks overlook. An extended version, tau2-bench, adds a telecom domain. The code is openly available on GitHub.
