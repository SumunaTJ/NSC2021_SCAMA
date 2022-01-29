from __future__ import print_function

import numpy as np
import os
from skimage import io 
import torchvision.transforms as transforms
import sys
import pandas as pd
import glob
import torch.nn as nn
import torch.nn.functional as F
import torch
from PIL import Image
from torch.autograd import Variable
import torchvision.utils as vutils
import matplotlib.pyplot as plt
from torchvision.utils import save_image


# Device
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
# print(f'Use device: {device}')

#to get the current working directory
directory = os.getcwd()
# print("current working dir: " + directory)

# Spatial size of training images. All images will be resized to this
#   size using a transformer.
image_size = 256

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

#RevealNet
class RevealNet(nn.Module):
    
    def __init__(self):
        super(RevealNet, self).__init__()
        self.main = nn.Sequential(
            nn.ZeroPad2d(get_same_padding(kernel_size=4)),
            nn.Conv2d(3,100,kernel_size=4,stride=1),
            nn.ReLU(inplace=True),
            nn.ZeroPad2d(get_same_padding(kernel_size=4)),
            nn.Conv2d(100,100,kernel_size=4,stride=1),
            nn.ReLU(inplace=True),
            nn.ZeroPad2d(get_same_padding(kernel_size=4)),
            nn.Conv2d(100,50,kernel_size=4,stride=1),
            nn.ReLU(inplace=True),
            nn.ZeroPad2d(get_same_padding(kernel_size=2)),
            nn.Conv2d(50,3,kernel_size=2,stride=1),
            nn.Tanh(),
        )

    def forward(self, input):
        return self.main(input)
    
# Create the generator
revl_net = RevealNet().to(device)

# Apply the weights_init function to randomly initialize all weights
#  to mean=0, stdev=0.2.
revl_net.apply(weights_init)

##Predict
#input model path
path = sys.argv[1:]
# print(path)

ListOfModels = glob.glob(os.path.join(path[0], "*.pt"))
# for file in ListOfModels:
#     print(file)
# print('models founded')

revl_net.load_state_dict(torch.load(os.path.join(path[0],'modelsrevl.pt'), map_location=device))

loader = transforms.Compose([
    transforms.Resize(image_size),
    transforms.CenterCrop(image_size),
    transforms.ToTensor(), 
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))])

def image_loader(image_name):
    image = Image.open(image_name)
    rgbimg = Image.new("RGB", image.size)
    rgbimg.paste(image)
    image = loader(rgbimg).float()
    image = image.unsqueeze(0) # Add batch dimension
    return image

def imshow(img):
    img = img / 2 + 0.5     # unnormalize
    npimg = img.numpy()
    plt.imshow(np.transpose(npimg, (1, 2, 0)))
    plt.xticks([])
    plt.yticks([])
    plt.show()

contimg_path = path[1]
# print("your image path is: " + contimg_path)

contimg = image_loader(contimg_path)
# print(contimg.shape)

    
with torch.no_grad():
    # Set dropout and batch normalization layers to evaluation mode
    revl_net.eval()

    # Reveal
    rec_hidden_img = revl_net(contimg)

secret_path = path[2]
save_image(rec_hidden_img, secret_path)
print(secret_path)

sys.stdout.flush()