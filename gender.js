document.addEventListener('DOMContentLoaded', () => {
        let nameInput = document.querySelector('.container .user-input-box input');
        let searchBtn = document.querySelector('.container .user-input-box button');
        let nameTxt = document.querySelector('.container .result-box .name');
        let genderLogo = document.querySelector('.container .result-box .gender-logo');
        let gender = document.querySelector('.container .result-box .gender');
        let probability = document.querySelector('.container .result-box .probability');
        let resultBox = document.querySelector('.container .result-box');
    
        let loadingAnimation = '<div class="loader"></div>'; // Loader for feedback during fetch
    
        // Function to display the feedback options
        let showFeedbackOptions = () => {
            resultBox.innerHTML = `
                <div class="name">${nameTxt.innerHTML}</div>
                <div class="gender-logo">${genderLogo.innerHTML}</div>
                <div class="gender">${gender.innerHTML}</div>
                <div class="probability">${probability.innerHTML}</div>
                <div class="feedback-options">
                    <button class="correct">Correct</button>
                    <button class="incorrect">Incorrect</button>
                </div>
            `;
        };
    
        // Function to handle the user feedback
        let handleFeedback = (isCorrect) => {
            // Perform actions based on feedback
            if (isCorrect) {
                // Implement logic to remember correct prediction
            } else {
                // Implement logic to remember incorrect prediction
            }
            // Reset the UI
            resultBox.innerHTML = `
                <div class="name">Thank you for your feedback!</div>
            `;
        };
    
        let predictGender = async (name) => {
            try {
                resultBox.style.display = 'block';
                resultBox.innerHTML = loadingAnimation; // Show loader
                
                let firstName = name.split(' ')[0]; // Extract the first name
                let url = 'https://api.genderize.io?name=';
                let response = await fetch(url + firstName);
                if (!response.ok) throw new Error('Network response was not ok');
                
                let data = await response.json();
                
                if (!data.gender) throw new Error('Gender not found');
                
                nameTxt.innerHTML = name; // Show full name
                gender.innerHTML = data.gender.charAt(0).toUpperCase() + data.gender.slice(1);
                probability.innerHTML = `Probability: ${(data.probability * 100).toFixed(2)}%`;
                
                if (data.gender === 'female') {
                    resultBox.style.background = '#F576AB';
                    genderLogo.innerHTML = `<ion-icon name="woman-outline"></ion-icon>`;
                    genderLogo.style.color = '#F576AB';
                } else {
                    resultBox.style.background = '#5BC4F3';
                    genderLogo.innerHTML = `<ion-icon name="man-outline"></ion-icon>`;
                    genderLogo.style.color = '#5BC4F3';
                }
                
                // Display feedback options
                showFeedbackOptions();
                
                // Add event listeners for feedback buttons
                let correctBtn = document.querySelector('.feedback-options .correct');
                let incorrectBtn = document.querySelector('.feedback-options .incorrect');
                correctBtn.addEventListener('click', () => handleFeedback(true));
                incorrectBtn.addEventListener('click', () => handleFeedback(false));
    
                // Speak the predicted gender
                speakGender(data.gender);
    
            } catch (error) {
                resultBox.style.background = '#FF6F61'; // Error background color
                resultBox.innerHTML = `<div class="name">Error</div><div class="gender-logo">⚠️</div><div class="gender">${error.message}</div>`;
            }
        };
    
        searchBtn.addEventListener('click', () => {
            if (nameInput.value.length > 0 && /^[A-Za-z\s]+$/.test(nameInput.value)) {
                predictGender(nameInput.value.trim());
            } else {
                resultBox.style.display = 'block';
                resultBox.style.background = '#FF6F61'; // Error background color
                resultBox.innerHTML = `<div class="name">Invalid Input</div><div class="gender-logo">⚠️</div><div class="gender">Please enter a valid name</div>`;
            }
        });
    
        // Function to speak the predicted gender
        let speakGender = (gender) => {
            // Check if browser supports Web Speech API
            if ('speechSynthesis' in window) {
                // Create a new instance of SpeechSynthesisUtterance
                var msg = new SpeechSynthesisUtterance();
                // Set the text to be spoken
                msg.text = `The predicted gender is ${gender}.`;
                // Invoke speech synthesis
                window.speechSynthesis.speak(msg);
            } else {
                console.error('Web Speech API is not supported by this browser.');
            }
        };
    
    });
    