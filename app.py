from flask import Flask, render_template, request, redirect, session

from werkzeug.security import generate_password_hash, check_password_hash
import mysql.connector

app = Flask(__name__)
app.secret_key = "supersecretkey123"

def get_db():
    return mysql.connector.connect(
        host="127.0.0.1",
        user="root",
        password="Maninblack90",
        database="hotel_security"
    )


@app.route("/")#if methods is not mention the flask will automatically use GET method
def home():
    return render_template("home.html")


@app.route("/booking")
def booking():
    return render_template("booking.html")


@app.route("/submit_booking", methods=["POST"])
def submit_booking():
    name = request.form.get("name")
    email = request.form.get("email")
    phone = request.form.get("phone")
    checkin = request.form.get("checkin")
    checkout = request.form.get("checkout")
    roomtype = request.form.get("roomtype")

    # if html fail for some reason and instead of error it will disply this if the user hasnt fill up in the requred place
    # if not name or not email or not phone or not checkin or not checkout or not roomtype:
    #     return "Please fill all of them before submitting the booking."  

    if not all([name,email,phone, checkin, checkout, roomtype]):
        return("please fill all of them before submiting!")
    
    import mysql.connector

    # mydb = mysql.connector.connect(
    #     host="127.0.0.1",
    #     user="root",
    #     password="Maninblack90",
    #     database="hotel_security"
    # )
    mydb = get_db()

    cursor = mydb.cursor() #let use wirte in database

    query = "INSERT INTO bookings (Name, Email, Phone, CheckIn, CheckOut, RoomType) VALUES (%s, %s, %s, %s, %s, %s)"
    values = (name, email, phone, checkin, checkout, roomtype)

    cursor.execute(query, values) #save user input and quesry to db
    mydb.commit()#its llike a save button

    cursor.close() #closed the cursor
    mydb.close()

    return """<h2>Booking saved successfully!</h2> <a href="/">Go to home</a><br><a href="/booking">want to book again!!!</a>"""


# ---------------- ADMIN LOGIN ---------------- #

@app.route("/admin_login", methods=["GET", "POST"]) #post to get data from user and GET help user to open the path example https://hotel.com/admin_login it will work but if ther is only POST reqeust then the link wont work
def admin_login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        # Hardcoded admin credentials
        if username == "admin" and password == "admin123":
            session["admin"] = True
            return redirect("/admin_dashboard")
        else:
            return "Invalid username or password!"

    return render_template("admin_login.html")



@app.route("/admin_dashboard")
def admin_dashboard():
    if "admin" not in session:
        return redirect("/admin_login")#

    import mysql.connector

    # mydb = mysql.connector.connect(
    #     host="127.0.0.1",
    #     user="root",
    #     password="Maninblack90",
    #     database="hotel_security"
    # )
    mydb = get_db()


    cursor = mydb.cursor()
    cursor.execute("SELECT * FROM bookings")
    bookings = cursor.fetchall()

    cursor.close()
    mydb.close()

    return render_template("admin_dashboard.html", bookings=bookings)#right bookings is python verson of getting data from DB and left is html version of getting data


@app.route("/logout")
def logout():
    session.pop("admin", None) # NONE prevent runtime error if the admin is not in the session
    return redirect("/admin_login")

#admin remove booking
@app.route("/delete_booking/<int:booking_id>")
def delete_booking(booking_id):
    if "admin" not in session:
        return redirect("/admin_login")

    import mysql.connector

    # mydb = mysql.connector.connect(
    #     host="127.0.0.1",
    #     user="root",
    #     password="Maninblack90",
    #     database="hotel_security"
    # )
    mydb = get_db()


    cursor = mydb.cursor()
    cursor.execute("DELETE FROM bookings WHERE BookingID = %s", (booking_id,))
    mydb.commit()

    cursor.close()
    mydb.close()

    return redirect("/admin_dashboard")



#signup 
@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        password = request.form.get("password")

        password_hash = generate_password_hash(password, method='pbkdf2:sha256')

        # mydb = mysql.connector.connect(
        #     host="127.0.0.1",
        #     user="root",
        #     password="Maninblack90",
        #     database="hotel_security"
        # )
        mydb = get_db()


        cursor = mydb.cursor()
        try: 
            cursor.execute(
             "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)",
            (name, email, password_hash)
        )
            
        except mysql.connector.errors.IntegrityError:
            return "Email already exists! Please use another email."
        

        mydb.commit()
        cursor.close()
        mydb.close()

        return redirect("/login")

    return render_template("signup.html")

#login
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        # mydb = mysql.connector.connect(
        #     host="127.0.0.1",
        #     user="root",
        #     password="Maninblack90",
        #     database="hotel_security"
        # )
        mydb = get_db()


        cursor = mydb.cursor()
        cursor.execute("SELECT password_hash FROM users WHERE email=%s", (email,))
        user = cursor.fetchone()

        cursor.close()
        mydb.close()

        if user and check_password_hash(user[0], password):
            session["user"] = email
            return redirect("/user_dashboard")
        else:
            return "Invalid Email or Password"

    return render_template("login.html")



@app.route("/user_dashboard")
def user_dashboard():
    if "user" not in session:
        return redirect("/login")

    user_email = session["user"]

    # mydb = mysql.connector.connect(
    #     host="127.0.0.1",
    #     user="root",
    #     password="Maninblack90",
    #     database="hotel_security"
    # )
    mydb = get_db()


    cursor = mydb.cursor(dictionary=True)

    # get user info
    cursor.execute("SELECT id, name, email FROM users WHERE email = %s", (user_email,))
    user_info = cursor.fetchone()

    # get bookings for this user
    cursor.execute("SELECT * FROM bookings WHERE Email = %s", (user_email,))
    bookings = cursor.fetchall()

    cursor.close()
    mydb.close()

    return render_template("user_dashboard.html",
                           user=user_info,
                           bookings=bookings)


#logout
@app.route("/user_logout")
def user_logout():
    session.pop("user", None)
    return redirect("/login")


if __name__ == "__main__":
    app.run(debug=True)
    

