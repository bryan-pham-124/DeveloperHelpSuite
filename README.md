# About this project

- Description
	- This application is a prototype of what a useful “one stop shop” developer knowledge base could be. My application has a section where developers can ask questions and get answers on their technical issues. Developers can also answer other questions. In addition, there is a resources section, where developers can share resources and write articles on topics/ technologies users may have trouble with.


- Inspiration
  	- The main inspiration for this project was a common situation at work where developers at my workplace often had questions about how to solve certain issues in projects or how certain technical concepts work. Fortunately, other developers at the company would know the answer. I thought it would be useful for an application where users can ask questions and get answers and store those questions in a database and answer in case another developer came across the same issue later. In addition, having a knowledge base with specific tutorials for specific commonly encountered issues would be very helpful for users.


## Tech Stack

- Front End  
	- Tailwind CSS
		- CSS Framework for quickly applying styles to pages and makes webpages responsive.
	- React.js
		- Dynamically render components and manages state on the front end UI.

- Back End
	- Mongo db
		- Database for my application where all of data is stored in the backend.
	- Prisma
		- No orm framework to fetch data from database and modify it.
	- Bcrypt.js
		- Framework that encrypts passwords and preventing storing plain text passwords.
	- Remix.js
		- JavaScript framework that allows for back end and front end code to interact with each other seamlessly.
	

## Features of this app


- Form input and validation:
     - Forms validate user data and display errors.
     - If thera are errors, forms will force users to correct errors before they can submit.
      
- Account creation:
     - Users can create and login to their accounts. 
     - Only people with accounts can post answers and reply to posts.

- Authentication
     - Can authenticate users and see if they have a valid password to login into their account.

- Roles
   - Users can do the following to posts:
	 - Upvote
	 - Downvote
	 - Reply 
	 - Edit/delete their own post
   - Moderators can do the following to posts:
	   - Remove/edit posts.
	   - All other tasks normal users can do.

## Questions Feature

- Users can create questions that can have the following:
	- Text
	- Code snippets
	- links

- In addition, questions have the following data:
	- Author name
	- Date
	- Score count (upvotes - downvotes)
	- Toggleable status (problem is solved/ not solved)
	- Tag (shows what technology/problem this problem is addressing
	- Priority (how quickly a user needs the problem to be solved)

- Questions can be:
	- Up/down voted by users with one vote per uiser
	- Replied to
	
- Replies to questions can be:
	- Replied to
	- Be up/down voted
	- Edited or deleted by the original question poster.
 
- Questions can be sorted by:
	- Upvotes
	- Date
	- Priority

- Questions can be filtered by:
	- Status
	- Tech/tag
	- Priority

## Resource Articles

- Users can create articles and choose from:
	- Adding a new technology to the application.
	- Adding articles to existing technologies.

- Articles can be:
	- Upvoted
	- Downvoted	
	- Replied to
	- Edited or deleted by original user who posted article.






