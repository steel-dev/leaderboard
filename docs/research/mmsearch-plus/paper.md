# Title:ScaleFlow++: Robust and Accurate Estimation of 3D Motion from Video

**Source:** https://arxiv.org/abs/2409.12202

## Abstract


            Abstract:Perceiving and understanding 3D motion is a core technology in fields such as autonomous driving, robots, and motion prediction. This paper proposes a 3D motion perception method called ScaleFlow++ that is easy to generalize. With just a pair of RGB images, ScaleFlow++ can robustly estimate optical flow and motion-in-depth (MID). Most existing methods directly regress MID from two RGB frames or optical flow, resulting in inaccurate and unstable results. Our key insight is cross-scale matching, which extracts deep motion clues by matching objects in pairs of images at different scales. Unlike previous methods, ScaleFlow++ integrates optical flow and MID estimation into a unified architecture, estimating optical flow and MID end-to-end based on feature matching. Moreover, we also proposed modules such as global initialization network, global iterative optimizer, and hybrid training pipeline to integrate global motion information, reduce the number of iterations, and prevent overfitting during training. On KITTI, ScaleFlow++ achieved the best monocular scene flow estimation performance, reducing SF-all from 6.21 to 5.79. The evaluation of MID even surpasses RGBD-based methods. In addition, ScaleFlow++ has achieved stunning zero-shot generalization performance in both rigid and nonrigid scenes. Code is available at \url{this https URL}.
    

---
*Scraped from arxiv abstract page*
