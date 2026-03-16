# Title:PINN-FEM: A Hybrid Approach for Enforcing Dirichlet Boundary Conditions in Physics-Informed Neural Networks

**Source:** https://arxiv.org/abs/2501.07765

## Abstract


            Abstract:Physics-Informed Neural Networks (PINNs) solve partial differential equations (PDEs) by embedding governing equations and boundary/initial conditions into the loss function. However, enforcing Dirichlet boundary conditions accurately remains challenging, often leading to soft enforcement that compromises convergence and reliability in complex domains. We propose a hybrid approach, PINN-FEM, which combines PINNs with finite element methods (FEM) to impose strong Dirichlet boundary conditions via domain decomposition. This method incorporates FEM-based representations near the boundary, ensuring exact enforcement without compromising convergence. Through six experiments of increasing complexity, PINN-FEM outperforms standard PINN models, showcasing superior accuracy and robustness. While distance functions and similar techniques have been proposed for boundary condition enforcement, they lack generality for real-world applications. PINN-FEM bridges this gap by leveraging FEM near boundaries, making it well-suited for industrial and scientific problems.
    

---
*Scraped from arxiv abstract page*
