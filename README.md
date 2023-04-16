About this project

Description

This application is a prototype of what a useful “one stop shop” developer knowledge base could be.  My application has a section where developers can ask questions and get answers on their technical issues. Developers can also answer other questions. In addition, there is a resources section, where developers can share resources and write articles on topics/ technologies users may have trouble with.


Inspiration

The main inspiration for this project was a common situation at work where developers at my workplace often had questions about how to solve certain issues in projects or how certain technical concepts work. Fortunately, other developers at the company would know the answer. I thought it would be useful for an application where users can ask questions and get answers and store those questions in a database and answer in case another developer came across the same issue later. In addition, having a knowledge base with specific tutorials for specific commonly encountered issues would be very helpful for users.


Tech Stack

Mongo db
Database for my application

React.js
Renders components and manages state in the front end

Tailwind css
CSS Framework for quickly applying styles to pages

Prisma
No orm framework to query database

 Bcrypt.js
Framework that encrypts passwords and preventing storing plain text passwords

 Remix.js
           JavaScript framework that allows for back end and front end code to interact with each other seamlessly


Features of this app

Form input and validation

-  Validated forms can create and edit entries on the database
 - Forms validate user data and display errors

Account creation

	- Users can create and login to their accounts.
	- Only people with accounts can post answers and reply to posts.

Authentication

- Can authenticate users and see if they have a valid password to login into their account.

Roles

	- Users can do the following to posts:
Upvote
Downvote
Reply to
Edit/delete their own post

	- Moderators can do the following to posts:
remove/edit posts 
 can do everything regular users do 
Questions

- Users can create questions that can have the following:
text
code snippets
Links

- In addition questions have:
Author name
date
score count (upvotes - downvotes)
toggleable status (problem is solved/ not solved)
tag (shows what technology/problem this problem is addressing
priority(how quickly a user needs the problem to be solved)

- Questions can be:
up/down voted by users with one vote per uiser
replied to
- Replies to questions can also be:
replied to
be up/down voted
edited or deleted by the original question poster
 
- Questions can be sorted by:
upvotes
date
Priority

- Questions can be filtered by:
status
tech/tag
priority

Resource Articles

- Users can create articles and choose from:
adding a new technology to the application
adding articles to existing technologies

- Articles can be:
upvoted
downvoted
replied tp
edited or deleted by original user who posted article






