import os
from flask import Flask, flash, jsonify, redirect, render_template, request, session
import psycopg2  # 使用 psycopg2 替代 cs50 的 SQL 库

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# 从环境变量获取 PostgreSQL 连接信息
DATABASE_URL = os.environ.get('DATABASE_URL')

# 连接到 PostgreSQL 数据库
def get_db():
    return psycopg2.connect(DATABASE_URL, sslmode='require')

# 替换 CS50 的 SQL 函数
def execute_query(query, *args):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(query, args)
    if query.strip().upper().startswith("SELECT"):
        result = cur.fetchall()
    else:
        conn.commit()
        result = None
    cur.close()
    conn.close()
    return result

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        message = ""
        name = request.form.get("name")
        month = request.form.get("month")
        day = request.form.get("day")
        if not name:
            message = "Missing name"
        elif not month:
            message = "Missing month"
        elif not day:
            message = "Missing day"
        else:
            # 插入数据到 PostgreSQL
            execute_query(
                "INSERT INTO birthdays (name, month, day) VALUES (%s, %s, %s)",
                name, month, day
            )
        # 查询所有生日记录
        birthdays = execute_query("SELECT * FROM birthdays")
        return render_template("index.html", message=message, birthdays=birthdays)
    else:
        # 查询所有生日记录
        birthdays = execute_query("SELECT * FROM birthdays")
        return render_template("index.html", birthdays=birthdays)