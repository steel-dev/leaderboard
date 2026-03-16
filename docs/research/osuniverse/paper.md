# Title:Code generation and runtime techniques for enabling data-efficient deep learning training on GPUs

**Source:** https://arxiv.org/abs/2412.04747

## Abstract


            Abstract:As deep learning models scale, their training cost has surged significantly. Due to both hardware advancements and limitations in current software stacks, the need for data efficiency has risen. Data efficiency refers to the effective hiding of data access latency and the avoidance of unnecessary data movements. Major challenges arise from the growing disparity between GPU memory bandwidth and computational throughput, imminent GPU memory capacity limitations, and inefficiencies in the PyTorch software stack, including a lack of device-specific PCIe transfer optimizations and high-level domain-specific abstractions. To effectively mitigate these data inefficiencies for deep learning training, this dissertation analyzes data inefficiency in representative deep training tasks, specifically in graph neural networks (GNNs) and large language models (LLMs). It then proposes novel runtime and code generation techniques to mitigate these challenges and implements these optimizations seamlessly within the PyTorch stack while maintaining strong programmability and interoperability. First, PyTorch-Direct is devised to incorporate the GPU-centric PCIe data transfer paradigm in PyTorch for GNN training. Next, Hector intermediate representation (IR) and its code generator are proposed to introduce domain-specific high-level abstraction and systematically address memory-intensive performance challenges for relational GNNs. Finally, in LLM training, the throughput has been increasingly constrained by GPU memory capacity. To mitigate this, the SSDTrain offloading framework is designed and implemented. Together, these contributions show that code generation and runtime techniques can systematically mitigate the data management bottlenecks in deep learning training, which stem from the data-intensive nature of workloads and the oversimplification inherent in the deep learning training software stack.
    

---
*Scraped from arxiv abstract page*
