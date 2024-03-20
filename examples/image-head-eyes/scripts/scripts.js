function openCvReady() {
    cv['onRuntimeInitialized'] = onRuntimeInitialized;

    // setTimeout(() => {
    //     onRuntimeInitialized();
    // }, 2000);
}

function onRuntimeInitialized() {
    const utils = new Utils('errorMessage');
    const src = cv.imread('canvasInput');
    const msize = new cv.Size(0, 0);
    const gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

    const faceClassifier = addClassifier( 'haarcascade_frontalface_default.xml', '../../common/cascades/haarcascade_frontalface_default.xml', cv, utils);
    const eyeClassifier = addClassifier( 'haarcascade_eye.xml', '../../common/cascades/haarcascade_eye.xml', cv, utils);

    setTimeout(() => {
        console.log(faceClassifier);
        const faces = new cv.RectVector();
        faceClassifier.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);
        const coordinatesFaces = getCoordinates(faces);
        console.log(coordinatesFaces);

        const eyes = new cv.RectVector();
        eyeClassifier.detectMultiScale(gray, eyes);
        const coordinatesEyes = getCoordinates(eyes);
        console.log(coordinatesEyes);

        src.delete();
        gray.delete();
        faceClassifier.delete();
        eyeClassifier.delete();
        faces.delete();
        eyes.delete();
    }, 100);
}

function addClassifier(path, url, cv, utils) {
    const classifier = new cv.CascadeClassifier();
    utils.createFileFromUrl(path, url, () => {
        classifier.load(path);
    });
    return classifier;
}

function getCoordinates(rectVector) {
    const coordinates = [];
    for (let i = 0; i < rectVector.size(); ++i) {
        coordinates.push(rectVector.get(i));
    }

    return coordinates;
}
