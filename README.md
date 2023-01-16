# unsplash-wizard

Dataset on huggingface: https://huggingface.co/datasets/p1atdev/resplash

# Usage

1. Create dump json

```bash
deno task start dump "search word" -l 100 -o ./data.json --detail 
```

2. Download images and captions

```bash
deno task start download ./data.json -o ./output 
```

## Commands

```
  Usage:   unsplash-wizard
  Version: 0.1.1

  Description:

    Unsplash Images Downloader

  Options:

    -h, --help     - Show this help.
    -V, --version  - Show the version number for this program.

  Commands:

    dump      <query>  - Search for images
    download  <path>   - Download images from a json file
```

### dump

```
  Options:

    -h, --help               - Show this help.
    -l, --limit   <number>   - Number of images to download                                   (Default: 30)
    -o, --output  <path>     - Output directory                                               (Default: "./unsplash")
    --detail      [boolean]  - Get more details about the images. This may take a long time.  (Default: false)       
    -k, --key     <string>   - Unsplash access key
```

### download

```
  Options:

    -h, --help                          - Show this help.
    -o, --output             <path>     - Output directory                                         (required)        
    --detail                 [boolean]  - Download detailed images                                 (Default: true)   
    --size                   <string>   - Image size                                               (Default: "small")
    -c, --caption                       - Save image captions                                      (Default: true)   
    --likes                  <number>   - Minimum likes                                            (Default: 10)     
    --color                  [boolean]  - Add color code to captions                               (Default: false)  
    --inaccurateDescription  [boolean]  - Add VERY inaccurate captions. Not recommended            (Default: false)  
    --location               [boolean]  - Add location information of the photo shoot to captions  (Default: true)   
    --exif                   [boolean]  - Add camera information to captions                       (Default: true)   
    --relatedTags            [boolean]  - Add related tags to captions                             (Default: false)  
    --batch                  <batch>    - Batch size.(Be polite!)                                  (Default: 100) 
```