from __future__ import print_function
import sys
import glob
import numpy as np
import os
from skimage import io 
import torch
import torchvision.utils as vutils
import matplotlib.pyplot as plt
from torchvision.utils import save_image
import torchvision.datasets as dset
import torchvision.transforms as transforms
import torch.nn as nn
import torch.nn.functional as F
from PIL import Image
from torch.autograd import Variable

# Device
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
print(f'Use device: {device}')

# MODELS PATH
# MODELS_PATH = '/home/hideimg/workspace/DeepSteg-master/output/models'

# Spatial size of training images. All images will be resized to this
#   size using a transformer.
image_size = 256

#Model
# custom weights initialization
def weights_init(m):
    classname = m.__class__.__name__
    if classname.find('Conv') != -1:
        nn.init.normal_(m.weight.data, 0.0, 0.02)
    elif classname.find('BatchNorm') != -1:
        nn.init.normal_(m.weight.data, 1.0, 0.02)
        nn.init.constant_(m.bias.data, 0)
        
def get_same_padding(kernel_size):
    ka = kernel_size // 2
    kb = ka - 1 if kernel_size % 2 == 0 else ka
    return ka, kb, ka, kb

class PreparationNet(nn.Module):
    
    def __init__(self):
        super(PreparationNet, self).__init__()
        self.main = nn.Sequential(
            nn.ZeroPad2d(get_same_padding(kernel_size=4)), 
            nn.Conv2d(3,50,kernel_size=4,stride=1),
#             nn.BatchNorm2d(50),
            nn.ReLU(inplace=True),
            nn.ZeroPad2d(get_same_padding(kernel_size=4)), 
            nn.Conv2d(50,50,kernel_size=4,stride=1),
#             nn.BatchNorm2d(50),
            nn.ReLU(inplace=True),
            nn.ZeroPad2d(get_same_padding(kernel_size=4)), 
            nn.Conv2d(50,50,kernel_size=4,stride=1),
#             nn.BatchNorm2d(50),
            nn.ReLU(inplace=True),
            nn.ZeroPad2d(get_same_padding(kernel_size=2)), 
            nn.Conv2d(50,30,kernel_size=2,stride=1),
#             nn.BatchNorm2d(30),
            nn.ReLU(inplace=True),
            nn.ZeroPad2d(get_same_padding(kernel_size=2)), 
            nn.Conv2d(30,7,kernel_size=2,stride=1),
#             nn.BatchNorm2d(7),
            nn.Tanh(),
        )

    def forward(self, input):
        return self.main(input)
    
# Create the generator
prep_net = PreparationNet().to(device)

# Apply the weights_init function to randomly initialize all weights
#  to mean=0, stdev=0.2.
prep_net.apply(weights_init)

class HidingNet(nn.Module):
    
    def __init__(self):
        super(HidingNet, self).__init__()
        self.main = nn.Sequential(
            nn.ZeroPad2d(get_same_padding(kernel_size=4)),
            nn.Conv2d(10,50,kernel_size=4,stride=1),
            nn.ReLU(inplace=True),
            nn.ZeroPad2d(get_same_padding(kernel_size=4)),
            nn.Conv2d(50,50,kernel_size=4,stride=1),
            nn.ReLU(inplace=True),
            nn.ZeroPad2d(get_same_padding(kernel_size=4)),
            nn.Conv2d(50,50,kernel_size=4,stride=1),
            nn.ReLU(inplace=True),
            nn.ZeroPad2d(get_same_padding(kernel_size=4)),
            nn.Conv2d(50,50,kernel_size=4,stride=1),
            nn.ReLU(inplace=True),
            nn.ZeroPad2d(get_same_padding(kernel_size=2)),
            nn.Conv2d(50,30,kernel_size=2,stride=1),
            nn.ReLU(inplace=True),
            nn.ZeroPad2d(get_same_padding(kernel_size=2)),
            nn.Conv2d(30,3,kernel_size=2,stride=1),
            nn.Tanh(),
        )

    def forward(self, input):
        return self.main(input)
    
# Create the generator
hide_net = HidingNet().to(device)

# Apply the weights_init function to randomly initialize all weights
#  to mean=0, stdev=0.2.
hide_net.apply(weights_init)

# Load model
path = sys.argv[1:]
# print(path)

# ListOfModels = glob.glob(os.path.join(path[0], "*.pt"))
# for file in ListOfModels:
#     print(file)
# print('models founded')

prep_net.load_state_dict(torch.load(os.path.join(path[0],'modelsprep.pt'), map_location=device))
hide_net.load_state_dict(torch.load(os.path.join(path[0],'modelshide.pt'), map_location=device))


loader = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.CenterCrop(image_size),
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))])

def image_loader(image_name):
    """load image, returns cuda tensor"""
    image = Image.open(image_name)
    rgbimg = Image.new("RGB", image.size)
    rgbimg.paste(image)
    image = loader(rgbimg).float()
    image = image.unsqueeze(0) # Add batch dimension
    return image
    
#input path of host & hid img
hover = path[1]
# print("hover image path is: " + hover)
hiding = path[2]
# print("hiding image path is: " + hiding)

hoimg = image_loader(hover)
hiimg = image_loader(hiding)

# print(hoimg, hiimg)

with torch.no_grad():
    # Set dropout and batch normalization layers to evaluation mode
    prep_net.eval()
    hide_net.eval()
    
    # Prepare inputs before hiding
    prep_img = prep_net(hiimg.to(device))
    concat_img = torch.cat((hoimg.to(device), prep_img), dim=1)

    # Hide
    container_img = hide_net(concat_img)

cont_img = container_img / 2 + 0.5
save_path = path[3]
save_image(cont_img, save_path)
print(save_path)
# print("save image at: " + save_path)

sys.stdout.flush()