ABOUTME: 200-word summary of the GPQA Diamond AI agent benchmark.
ABOUTME: Synthesized from paper abstract and GitHub README.

# GPQA Diamond

GPQA (Graduate-Level Google-Proof Q&A) is a benchmark of 448 multiple-choice questions written by domain experts in biology, physics, and chemistry, introduced by David Rein et al. in November 2023. GPQA Diamond is the hardest curated subset of 198 questions, selected for maximum difficulty and quality. Questions are designed to be "Google-proof," meaning skilled non-experts cannot answer them even with 30+ minutes of unrestricted web access. The dataset is available on Hugging Face and via a password-protected download.

Domain experts with PhDs in the relevant fields achieve 65% accuracy (74% after discounting identified mistakes), while highly skilled non-expert validators reach only 34% despite extensive web research. At the original paper's release, the strongest GPT-4 baseline achieved 39% accuracy. Current frontier reasoning models have pushed significantly higher, with o3-high reaching 83.4% and o4-mini-high achieving 81.3% on the GPQA benchmark according to OpenAI's simple-evals results.

GPQA Diamond has become a standard evaluation in major model releases, featured prominently in OpenAI's simple-evals suite alongside MMLU and MATH. Its focus on graduate-level scientific reasoning that resists internet lookup makes it particularly valuable for measuring genuine domain understanding. The dataset is released under an MIT license.
