//
//  FaceTurnstileViewController.h
//  IDLFaceSDKDemoOC
//
//  Created by 阿凡树 on 2017/5/23.
//  Copyright © 2017年 Baidu. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef void (^successCompletion)(NSDictionary* images, UIImage* originImage);

@interface FaceTurnstileViewController : UIViewController

@property (nonatomic, readwrite, retain) UIImageView *displayImageView;
@property (nonatomic, readwrite, assign) BOOL hasFinished;
@property (nonatomic, readwrite, copy) successCompletion completion;

- (void)faceProcesss:(UIImage *)image;

- (void)closeAction;

@end
