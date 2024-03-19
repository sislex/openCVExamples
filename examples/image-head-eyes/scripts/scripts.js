function openCvReady() {
    cv['onRuntimeInitialized'] = () => {
        setTimeout(() => {
            let src = cv.imread('canvasInput');
            let gray = new cv.Mat();
            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
            let faces = new cv.RectVector();
            let eyes = new cv.RectVector();
            let faceClassifier = new cv.CascadeClassifier();
            let eyeClassifier = new cv.CascadeClassifier();

            // load pre-trained classifiers
            let utils = new Utils('errorMessage');
            let faceCascadeFilePath = 'haarcascade_frontalface_default.xml';
            let faceCascadeFileUrl = `../../common/cascades/${faceCascadeFilePath}`;
            utils.createFileFromUrl(faceCascadeFilePath, faceCascadeFileUrl, () => {
                faceClassifier.load(faceCascadeFilePath); // in the callback, load the face cascade from file
            });
            let eyeCascadeFilePath = 'haarcascade_eye.xml';
            let eyeCascadeFileUrl = `../../common/cascades/${eyeCascadeFilePath}`;
            utils.createFileFromUrl(eyeCascadeFilePath, eyeCascadeFileUrl, () => {
                eyeClassifier.load(eyeCascadeFilePath); // in the callback, load the eye cascade from file
            });

            setTimeout(() => {
                let msize = new cv.Size(0, 0);
                faceClassifier.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);
                for (let i = 0; i < faces.size(); ++i) {
                    let roiGray = gray.roi(faces.get(i));
                    let roiSrc = src.roi(faces.get(i));
                    let point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
                    let point2 = new cv.Point(faces.get(i).x + faces.get(i).width,
                        faces.get(i).y + faces.get(i).height);
                    cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
                    // detect eyes in face ROI
                    eyeClassifier.detectMultiScale(roiGray, eyes);
                    for (let j = 0; j < eyes.size(); ++j) {
                        let point1 = new cv.Point(eyes.get(j).x, eyes.get(j).y);
                        let point2 = new cv.Point(eyes.get(j).x + eyes.get(j).width,
                            eyes.get(j).y + eyes.get(j).height);
                        cv.rectangle(roiSrc, point1, point2, [0, 0, 255, 255]);
                    }
                    roiGray.delete(); roiSrc.delete();
                }
                cv.imshow('canvasOutput', src);
                src.delete(); gray.delete();
                faceClassifier.delete();
                eyeClassifier.delete(); faces.delete(); eyes.delete();
            }, 1000);
        },1000);
    };
}
