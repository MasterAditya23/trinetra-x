import cv2
import numpy as np

def apply_night_mode(frame, gamma=1.5):
    """
    Applies software-based low-light enhancement using Gamma Correction and CLAHE.
    """
    # 1. Gamma Correction (Brightens dark areas without washing out light areas)
    inv_gamma = 1.0 / gamma
    table = np.array([((i / 255.0) ** inv_gamma) * 255 for i in np.arange(0, 256)]).astype("uint8")
    gamma_corrected = cv2.LUT(frame, table)

    # 2. CLAHE (Contrast Limited Adaptive Histogram Equalization)
    # Convert to LAB color space to safely enhance contrast
    lab = cv2.cvtColor(gamma_corrected, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    
    # Apply CLAHE to the L (Lightness) channel
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)
    
    # Merge the channels back together
    limg = cv2.merge((cl, a, b))
    final_frame = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)
    
    return final_frame