import subprocess
import wolframalpha
import pyttsx3
import tkinter
import json
import random
import operator
import speech_recognition as sr
import datetime
import wikipedia
import webbrowser
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import cv2
import winshell
import pyjokes
import feedparser
import smtplib
import ctypes
import time
import requests
import shutil
import pyaudio
import spotipy
import mediapipe as mp
import tensorflow as tf
from spotipy.oauth2 import SpotifyClientCredentials
from twilio.rest import Client
from clint.textui import progress
from ecapture import ecapture as ec
from bs4 import BeautifulSoup
import win32com.client as wincl
from urllib.request import urlopen
import warnings

# Suppress TensorFlow and Abseil logging warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
warnings.filterwarnings('ignore', category=UserWarning, module='google.protobuf')

# Initialize the text-to-speech engine
engine = pyttsx3.init('sapi5')
voices = engine.getProperty('voices')
engine.setProperty('voice', voices[1].id)

def say(audio):
    engine.say(audio)
    engine.runAndWait()

def wishMe():
    hour = int(datetime.datetime.now().hour)
    if hour >= 0 and hour < 12:
        say("Good Morning Sir!")

    elif hour >= 12 and hour < 18:
        say("Good Afternoon Sir!")

    else:
        say("Good Evening Sir!")

    assname = "Jarvis 1 point o"
    say("I am your Assistant")
    say(assname)

def username():
    say("What should I call you, sir?")
    uname = takeCommand()
    say("Welcome Mister")
    say(uname)
    columns = shutil.get_terminal_size().columns

    print("#####################".center(columns))
    print(f"Welcome Mr. {uname}".center(columns))
    print("#####################".center(columns))

    say("How can I help you, Sir?")

def takeCommand():
    r = sr.Recognizer()

    with sr.Microphone() as source:
        print("Listening...")
        r.pause_threshold = 1
        r.adjust_for_ambient_noise(source, duration=1)  # Adjust for ambient noise
        audio = r.listen(source)

    try:
        print("Recognizing...")
        query = r.recognize_google(audio, language='en-in')
        print(f"User said: {query}\n")
    except sr.UnknownValueError:
        print("Google Speech Recognition could not understand audio")
        return "None"
    except sr.RequestError as e:
        print(f"Could not request results from Google Speech Recognition service; {e}")
        return "None"
    except Exception as e:
        print(f"Error: {e}")
        return "None"

    return query

def sendEmail(to, content):
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.ehlo()
    server.starttls()
    # Enable low security in gmail
    server.login('your email id', 'your email password')
    server.sendmail('your email id', to, content)
    server.close()

def openCameraAndRecognizeGesture():
    mp_hands = mp.solutions.hands
    hands = mp_hands.Hands()
    mp_drawing = mp.solutions.drawing_utils

    cap = cv2.VideoCapture(0)
    say("Opening camera...")
    if not cap.isOpened():
        say("Could not open the camera")
        return

    while True:
        ret, frame = cap.read()
        if not ret:
            say("Failed to capture image")
            break

        frame = cv2.flip(frame, 1)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = hands.process(rgb_frame)

        if result.multi_hand_landmarks:
            for hand_landmarks in result.multi_hand_landmarks:
                mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
                # Here you can add more logic to recognize specific gestures

        cv2.imshow('Camera', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):  # Press 'q' to exit the camera view
            break

    cap.release()
    cv2.destroyAllWindows()

client_id = 'da89eccb7a64421fa6a224155392ca3c'
client_secret = '57a341a36f3146158af6fc53618d66dc'
client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

def play_music(query):
    if 'play music' in query:
        # Search for a song
        result = sp.search(q='query', limit=1)
        if result['tracks']['items']:
            song_uri = result['tracks']['items'][0]['uri']
            os.system('spotify play ' + song_uri)
        else:
            print("No matching song found on Spotify")



if __name__ == '__main__':
    wishMe()
    username()
    while True:
        query = takeCommand().lower()

        if query is None:
            continue

        if 'wikipedia' in query:
            say('Searching Wikipedia...')
            query = query.replace("wikipedia", "")
            results = wikipedia.summary(query, sentences=2)
            say("According to Wikipedia")
            print(results)
            say(results)

        elif 'open youtube' in query:
            say('Opening YouTube Sir...')
            webbrowser.open("youtube.com")

        elif 'open google' in query:
            say('Opening Google Sir...')
            webbrowser.open("google.com")

        elif 'open stackoverflow' in query:
            webbrowser.open("stackoverflow.com")

        elif 'play music' in query:
            play_music(query)

        elif 'the time' in query:
            strTime = datetime.datetime.now().strftime("%H:%M:%S")
            say(f"Sir, the time is {strTime}")

        elif 'email to <name>' in query:
            try:
                say("What should I say?")
                content = takeCommand()
                to = "receiver email id"
                sendEmail(to, content)
                say("Email has been sent!")
            except Exception as e:
                print(e)
                say("Sorry, I am not able to send this email")
        elif 'open camera' in query:
            openCameraAndRecognizeGesture()
        
        elif 'exit' in query:
            say("Goodbye Sir!")
            break
