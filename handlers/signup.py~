#!/usr/bin/env python

import webapp2
import re
import hashlib
import random
import string

from google.appengine.ext import db
from wikidata import *

import sys
sys.path.append("../db") 

loginform="""
<html>
	<head>
		<title>Login</title>
		 <style type="text/css">
      .label {text-align: right}
      .error {color: red}
    </style>
	</head>
	<body>
		<h2>Login</h2>
		<form method="post">
      <table>
        <tr>
          <td class="label">
            Username
          </td>
          <td>
            <input type="text" name="username" value="%(username)s">
          </td>          
        </tr>
        <tr>
          <td class="label">
            Password
          </td>
          <td>
            <input type="password" name="password" value="">
          </td>          
        </tr>
        <tr>
        	 <td class="error">
        	 	%(loginerror)s
        	 </td>
        	</tr>
      </table>
      <input type="submit" value="login">
    </form>
	</body>
</html>
"""

signupform="""
<html>
  <head>
    <title>Sign Up</title>
    <style type="text/css">
      .label {text-align: right}
      .error {color: red}
    </style>
  </head>
  <body>
 <h2>Signup</h2>
    <form method="post">
      <table>
        <tr>
          <td class="label">
            Username
          </td>
          <td>
            <input type="text" name="username" value="%(username)s">
          </td>
          <td class="error">
            %(usererror)s
          </td>
        </tr>

        <tr>
          <td class="label">
            Password
          </td>
          <td>
            <input type="password" name="password" value="">
          </td>
          <td class="error">
            %(pwerror)s
          </td>
        </tr>

        <tr>
          <td class="label">
            Verify Password
          </td>
          <td>
            <input type="password" name="verify" value="">
          </td>
          <td class="error">
            %(pwmatcherror)s
          </td>
        </tr>
        <tr>
          <td class="label">
            Email (optional)
          </td>
          <td>
            <input type="text" name="email" value="%(email)s">
          </td>
          <td class="error">
            %(emailerror)s
          </td>
        </tr>
      </table>
      <input type="submit">
    </form>
	</body>
</html>
"""



class SignUpHandler(webapp2.RequestHandler):
	USER_RE 		= re.compile(r"^[a-zA-Z0-9_-]{3,20}$")
	PASSWD_RE 	= re.compile(r"^.{3,20}$")
	EMAIL_RE 	= re.compile(r"^[\S]+@[\S]+\.[\S]+$")
	
	def write_form(self,user="",usererror="",pwerror="",pwmatcherror="",email="",emailerror=""):
		self.response.out.write(signupform % {"username":user,"usererror":usererror,"pwerror":pwerror,\
		"pwmatcherror":pwmatcherror,"email":email,"emailerror":emailerror})
		
	
	def get(self):
		self.write_form()
	
	def post(self):
		#Get params
		user 		= self.request.get('username')
		passwd 	= self.request.get('password')
		verify 	= self.request.get('verify')
		email 	= self.request.get('email')
		
		#validate
		usermatch	= self.validate_user(user)
		passwdmatch	= self.validate_passwd(passwd)
		verifymatch	= self.validate_passwd_match(passwd, verify)
		emailmatch  = self.validate_email(email)
		userexists = self.user_exists(user)
			
		if usermatch and passwdmatch and verifymatch and emailmatch and not userexists:
			id = self.addUser(user, passwd, email)
			self.redirectToWelcome(user, id)
			
		
		usererror = ""
		emailerror = ""
		passwderr = ""
		passwdmatcherr = ""		
		
		if usermatch is None:
			usererror = "That is not a valid username"
		if passwdmatch is None:
			passwderr = "That is not a valid password"
		if verifymatch is None:
			passwdmatcherr = "Those passwords do not match"
		if emailmatch is None:
			emailerror = "That is not a valid email address"
		if userexists is True:
			usererror = "That user already exists" 
			
		self.write_form(user, usererror,passwderr,passwdmatcherr,email,emailerror)		
	
	def user_exists(self, username):
		query = "SELECT * FROM User WHERE UserName = '%s'" % username
		users = db.GqlQuery(query)
		
		if users.count() > 0:
			return True
		else:
			return False

	def addUser(self, user, password, email):
		salt = self.make_salt()
		passwd = self.secure_password(user, password, salt)
		newuser = User(UserName = user, Password = passwd, Salt = salt, Email = email)
		newuser.put()
		return newuser.key().id()
		
	def secure_password(self,username, password, salt):    
	  h = hashlib.sha256(username + password + salt).hexdigest()
	  return '%s,%s' % (h, salt)
		
	def make_salt(self):
		return ''.join(random.choice(string.letters) for x in xrange(5))
		
	def redirectToWelcome(self, username, id):
		#create a cookie and hash it
		user = User.get_by_id(int(id))
		usercookie = '%d|%s' % (id,hashlib.sha256(user.UserName + user.Salt).hexdigest())
		
		self.response.headers.add_header('Set-Cookie', 'user_id=%s; Path=/'% usercookie) 
		
		self.redirect("/")
		
	def validate_user(self, username):
		return self.USER_RE.match(username)
		
	def validate_passwd(self, passwd):
		if passwd == "":
			return None
		return self.PASSWD_RE.match(passwd)
		
	def validate_email(self, email):
		if email == "":
			return "verified" #return something other than empty string to show empty email is accepted
		return self.EMAIL_RE.match(email)
							
	def validate_passwd_match(self, passwd, verify):
		if passwd == verify:
			return verify
		else:
			return None
	
class WelcomeHandler(webapp2.RequestHandler):
	def get(self):
		usercookie = self.request.cookies.get('user_id', '0')
		validcookie = self.validate_cookie(usercookie)
		
		if validcookie:
			userid = usercookie.split('|')[0]
			user = User.get_by_id(int(userid))
			if user:
				self.response.out.write("<h2>Welcome, %(username)s</h2>" % {"username":user.UserName})
			else:
				self.redirect("/signup")		
		#go back to signup otherwise
		else:
			self.redirect("/signup")
		
	def validate_cookie(self, cookie):
		tokens = cookie.split('|')
		if len(tokens) > 1:
			userid = tokens[0]
			cookiehash = tokens[1]
			user = User.get_by_id(int(userid))

			hash = hashlib.sha256(user.UserName + user.Salt).hexdigest()
		
			if hash == cookiehash:
				return True
			else:
				return False
		else:
			return False
			
class LoginHandler(webapp2.RequestHandler):
	def get(self):
		self.write_form()
		
	def post(self):
		username	= self.request.get('username')
		passwd 	= self.request.get('password')
		
		user = self.get_user(username)
		
		if user:
			passhash = self.validate_passwd(user.UserName, passwd, user.Salt)
			if passhash == user.Password:				
				usercookie = '%d|%s' % (user.key().id(),hashlib.sha256(user.UserName + user.Salt).hexdigest())
				self.response.headers.add_header('Set-Cookie', 'user_id=%s; Path=/'% usercookie) 
				self.redirect("/")
		
		self.write_form(username,"Invalid login")
		
	def validate_passwd(self,username, password, salt):    
	  h = hashlib.sha256(username + password + salt).hexdigest()
	  return '%s,%s' % (h, salt)	  
	  
	def get_user(self, username):
		query = "SELECT * FROM User WHERE UserName = '%s'" % username
		users = db.GqlQuery(query)
		
		if users.count() == 1:
			return users[0]
		else:
			return None
		
	def write_form(self,user="",loginerror=""):
		self.response.out.write(loginform % {"username":user,"loginerror":loginerror})
		
		
class LogoutHandler(webapp2.RequestHandler):
	def get(self):
		self.response.headers.add_header('Set-Cookie', 'user_id=; Path=/') 
		self.redirect("/")
	def post(self):
		pass		
