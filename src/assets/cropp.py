import os
import nibabel as nib
import numpy as np

def crop_to_lesions(image_data, label_data):
    # Identify slices with lesions
    lesion_slices = np.unique(np.where(label_data > 0)[2])
    
    if lesion_slices.size == 0:
        print("No lesions found.")
        return image_data, label_data
    
    # Crop the data to include only slices with lesions
    min_slice = lesion_slices.min()
    max_slice = lesion_slices.max()
    
    cropped_image_data = image_data[:, :, min_slice:max_slice+1]
    cropped_label_data = label_data[:, :, min_slice:max_slice+1]
    
    return cropped_image_data, cropped_label_data

def save_nifti(data, affine, header, output_path):
    nifti_img = nib.Nifti1Image(data, affine, header)
    nib.save(nifti_img, output_path)

def process_files(image_path, label_path):
    # Load image and label files
    image_img = nib.load(image_path)
    label_img = nib.load(label_path)
    
    image_data = image_img.get_fdata()
    label_data = label_img.get_fdata()
    
    # Crop to lesions
    cropped_image_data, cropped_label_data = crop_to_lesions(image_data, label_data)
    
    # Get the directory and base filenames without extensions
    directory = os.path.dirname(image_path)
    base_image_name = os.path.splitext(os.path.basename(image_path))[0]
    base_label_name = os.path.splitext(os.path.basename(label_path))[0]
    
    # Construct output paths for cropped files
    output_image_path = os.path.join(directory, f"{base_image_name}_cropped.nii.gz")
    output_label_path = os.path.join(directory, f"{base_label_name}_cropped.nii.gz")
    
    # Save cropped files
    save_nifti(cropped_image_data, image_img.affine, image_img.header, output_image_path)
    save_nifti(cropped_label_data, label_img.affine, label_img.header, output_label_path)

    print(f"Cropped image saved to: {output_image_path}")
    print(f"Cropped label saved to: {output_label_path}")

if __name__ == "__main__":
    # Get the directory of the Python script
    directory = os.path.dirname(os.path.abspath(__file__))
    # Define paths to the image and label files
    image_path = os.path.join(directory, "bone_00047_lesion_01_0000.nii.gz")
    label_path = os.path.join(directory, "bone_00047_lesion_01.nii.gz")

    process_files(image_path, label_path)
