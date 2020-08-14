# Machine-Assisted Velocity Information Service (M.A.V.I.S.)

Hello! My name is Machine-Assisted Velocity Information Service, or M.A.V.I.S. for short. I was developed to assist with Bethel Velocity's bible reading plans, as well as facilitate information sharing within the community.

I run on the [Telegram Bot API](https://core.telegram.org/bots/api), and was developed with [Node.JS](https://nodejs.org/en/), incorporating the [ESV API](https://api.esv.org/).

I am currently running on version `2.0`!

---
## User Features
Here are some of things I can do for my users:

### Bible Passage of the Day
Every day, I'll send out the [Bible Passage of the Day](#uploading-of-bible-passages-new) to all subscribers of the bot. New users are subscribed to this feature by default when they `/start` the bot. 
#### Unsubscribing / Resubscribing `NEW!`
Users may unsubscribe from receiving the passages using the 
`/unsubscribe` command. They can always `/subscribe` again if they choose to.
#### Getting the Latest Passages
Users can retrieve the last passage(s) that were sent out by calling `/latest`.

### Testimonies `NEW!`
Users can submit testimonies to the server by using the `/shouthisname` command. Testimonies have to be [approved](#approving--rejecting-testimony-broadcasts-new) by an admin before they are broadcasted to all subscribers.

### Bethel Live `NEW!`
Users can retrieve the [latest link](#updating-the-bethel-live-link-new) to Bethel's weekly online services by calling `/livestream`.

### Feedback `NEW!`
Users can provide feedback (suggestions, comments, bug reports) by using the `/feedback` command.

### Help `NEW!`
A list of these features and their respective commands are detailed by the `/help` command.

### Flavour
I also respond to messages using some of Pastor Mavis' catchphrases! There are also some easter eggs waiting to be discovered!

---
## Admin Features
[Admins](#instatement-of-admin-privileges-new) have access to an additional menu through which they can `/manage` some of my privileged features:

### Announcements `NEW!`
Admins can broadcast text, image, or video announcements to all subscribers. These announcements require confirmation to be broadcast, and are broadcast [immediately].

### Approving / Rejecting Testimony Broadcasts `NEW!`
Admins are also able to view the list of testimony broadcast requests submitted by users on the server. They can approve a testimony to immediately broadcast it to all subscribers, or reject it and remove it from the list of requests.

### Updating the Bethel Live Link `NEW!`
Admins are also able to update the livestream link which users retrieve with the `/livestream` command.

---
## Maintainer's Guide
Though I am a bot, I still require some assistance in order to function properly!

### Uploading of Bible Passages `NEW!`
With the `2.0` update, maintainers can upload bible passages through a designated Google Sheets page powered with Google Apps Script. Contact one of the admins for access!

### Updating the Bethel Live Link
Maintainers should update the livestream link weekly to ensure the video link is accessible to users who call the `/livestream` command. See [above](#updating-the-bethel-live-link-new) for more details.

### Instatement of Admin Privileges `NEW!`
Admin privileges can only be granted by [developers](#redistribution) who have access to the database. Every time a new admin is added, the server has to be manually re-synced with the database with a little bit of `/magic`. Contact one of my [developers](#redistribution) for assistance!

---
## Future Updates
These are some of the features that my developers are planning to add in future (subject to developers' availability)! Suggestions through the `/feedback` command may also be listed here:

1. Polls
2. Scheduling of Announcement / Testimony Broadcasts
3. Developer Alerts

---
#### Redistribution
Developed by [Adriel](https://github.com/ad-s2dios), [Elliot](https://github.com/elliotmoose) and [Joel](https://github.com/lywjoel), 2020. Feel free to reproduce any part of this code base for your own use!
