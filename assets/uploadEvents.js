import { db } from "../Firebase/firebaseSetup.js"; 
import { collection, addDoc } from "firebase/firestore";

const events = [
  {
    "name": "Ladies' Golf & Brunch",
    "description": "Come join SuperTeam Pa Vancouver at Guildford Golf & Country Club, Surrey. Enjoy the relaxing atmosphere while sipping on your favorite drinks and treats! Don't miss out on this fun and unique experience!",
    "location": "Presidio Golf Course",
    "map": {
      "_latitude": 37.791295913285154,
      "_longitude": -122.46242952846161
    },
    "organizer": "Women's Golf Association",
    "date": "2024-12-01T19:00:00.000Z",
    "image": "gs://final-project-fec88.firebasestorage.app/golfCourse.jpg"
  },
  {
    "name": "Family Fun Golf Day",
    "description": "Bring your family to Lincoln Park Golf Course for a day of fun! Enjoy games, contests, and a beginner-friendly round of golf for everyone.",
    "location": "Lincoln Park Golf Course",
    "map": {
      "_latitude": 37.78246277657317,
      "_longitude": -122.49755756788305
    },
    "organizer": "Lincoln Park Golf Club",
    "date": "2024-12-03T19:00:00.000Z",
    "image": "gs://final-project-fec88.firebasestorage.app/golfCourse.jpg"
  },
  {
    "name": "Twilight Couples' Tournament",
    "description": "An exclusive evening couples-only golf tournament at The Olympic Club. End the night with a romantic dinner on the greens.",
    "location": "The Olympic Club",
    "map": {
      "_latitude": 37.709294245130366,
      "_longitude": -122.49423632947465
    },
    "organizer": "The Olympic Golf Committee",
    "date": "2024-12-05T19:00:00.000Z",
    "image": "gs://final-project-fec88.firebasestorage.app/golfCourse.jpg"
  },
  {
    "name": "Junior Golf Clinic",
    "description": "A family-friendly event at Lake Merced Golf Club focused on teaching kids the fundamentals of golf. Includes drills, prizes, and snacks!",
    "location": "Lake Merced Golf Club",
    "map": {
      "_latitude": 37.69574148190907,
      "_longitude": -122.47207400465238
    },
    "organizer": "Youth Golf Foundation",
    "date": "2024-12-10T19:00:00.000Z",
    "image": "gs://final-project-fec88.firebasestorage.app/golfCourse.jpg"
  },
  {
    "name": "Charity Golf Marathon",
    "description": "A marathon golf event to raise funds for local schools. Play as many holes as you can in one day at Green Hill Country Club.",
    "location": "Green Hill Country Club",
    "map": {
      "_latitude": 37.60311513131968,
      "_longitude": -122.40968758637162
    },
    "organizer": "Green Hill Charitable Trust",
    "date": "2024-12-12T19:00:00.000Z",
    "image": "gs://final-project-fec88.firebasestorage.app/golfCourse.jpg"
  },
  {
    "name": "Veterans' Appreciation Golf Tournament",
    "description": "Honor our veterans with this special tournament at Presidio Golf Course. Includes refreshments for participants and families.",
    "location": "Presidio Golf Course",
    "map": {
      "_latitude": 37.791295913285154,
      "_longitude": -122.46242952846161
    },
    "organizer": "Veterans' Golf League",
    "date": "2024-12-15T19:00:00.000Z",
    "image": "gs://final-project-fec88.firebasestorage.app/golfCourse.jpg"
  },
  {
    "name": "Sunrise Yoga & Golf",
    "description": "Start your morning with yoga on the greens at Lincoln Park Golf Course, followed by a 9-hole round of golf.",
    "location": "Lincoln Park Golf Course",
    "map": {
      "_latitude": 37.78246277657317,
      "_longitude": -122.49755756788305
    },
    "organizer": "Healthy Living Golf Club",
    "date": "2024-12-18T19:00:00.000Z",
    "image": "gs://final-project-fec88.firebasestorage.app/golfCourse.jpg"
  },
  {
    "name": "Elite Pro-Am Championship",
    "description": "Play alongside professionals in this prestigious event at The Olympic Club. Spectators welcome for free!",
    "location": "The Olympic Club",
    "map": {
      "_latitude": 37.709294245130366,
      "_longitude": -122.49423632947465
    },
    "organizer": "Pro-Am Association",
    "date": "2024-12-20T19:00:00.000Z",
    "image": "gs://final-project-fec88.firebasestorage.app/golfCourse.jpg"
  },
  {
    "name": "Glow-in-the-Dark Night Golf",
    "description": "A unique nighttime golf experience at Lake Merced Golf Club with glowing balls and lit-up fairways.",
    "location": "Lake Merced Golf Club",
    "map": {
      "_latitude": 37.69574148190907,
      "_longitude": -122.47207400465238
    },
    "organizer": "Night Golf Adventures",
    "date": "2024-12-22T19:00:00.000Z",
    "image": "gs://final-project-fec88.firebasestorage.app/golfCourse.jpg"
  },
  {
    "name": "Father's Day Golf & BBQ",
    "description": "Celebrate Father's Day with a fun golf game and BBQ feast at Green Hill Country Club. Family-friendly activities included!",
    "location": "Green Hill Country Club",
    "map": {
      "_latitude": 37.60311513131968,
      "_longitude": -122.40968758637162
    },
    "organizer": "Family Golf Network",
    "date": "2024-12-25T19:00:00.000Z",
    "image": "gs://final-project-fec88.firebasestorage.app/golfCourse.jpg"
  }
]


      

async function uploadEvents() {
  try {
    const eventsCollection = collection(db, "Event");
    for (const event of events) {
      await addDoc(eventsCollection, event);
      console.log(`Event "${event.name}" added to Firestore`);
    }
    console.log("All events have been uploaded successfully!");
  } catch (error) {
    console.error("Error uploading events:", error);
  }
}

uploadEvents();
