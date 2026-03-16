ABOUTME: 200-word summary of the MedAgentBench AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# MedAgentBench

MedAgentBench is a realistic virtual EHR (Electronic Health Record) environment for benchmarking medical LLM agents, developed by Stanford ML Group and published in NEJM AI in 2025. It comprises 300 patient-specific, clinically-derived tasks across 10 categories written by human physicians, paired with realistic profiles of 100 patients containing over 700,000 data elements. The environment is built on a FHIR-compliant interactive platform using the open-source HAPI FHIR JPA server, enabling agents to interact with standard medical APIs used in modern EHR systems.

Task categories include patient communication, information retrieval, data recording, test ordering, documentation, referral ordering, medication ordering, and patient data aggregation. Evaluation is based on task success rate measured against reference solutions. The best-performing model, Claude 3.5 Sonnet v2, achieves a success rate of 69.67%, with significant variation across task categories, indicating substantial room for improvement.

MedAgentBench is notable as the first benchmark requiring autonomous agent interactions with a realistic medical records environment rather than static question-answering. Its FHIR-compliant design means evaluation results translate directly to real-world EHR integration potential. The benchmark, codebase, and Docker-based environment are publicly available on GitHub for reproducible evaluation.
