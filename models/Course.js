const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v4');


class Course {
  constructor(title, price, img) {
    this.title = title;
    this.price = price;
    this.img = img;
    this.id = uuid();
  };

  static getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.join(__dirname, '..', 'data', 'courses.json'),
        'utf-8',
        (err, content) => {
          if (err) reject(err);
          else resolve(JSON.parse(content));
        }
      );
    });
  };

  static async getById(id) {
    const courses = await Course.getAll();

    return courses.find((course) => course.id === id);
  };

  static async update(course) {
    const courses = await Course.getAll();
    const ndx = courses.findIndex((c) => c.id === course.id);

    courses[ndx] = course;

    new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, '..', 'data', 'courses.json'),
        JSON.stringify(courses),
        (err, content) => {
          if (err) reject(err);
          else resolve(content);
        }
      );
    });
  };

  getCourse() {
    return {
      title: this.title,
      price: this.price,
      img: this.img,
      id: this.id
    };
  };

  async save() {
    const courses = await Course.getAll();
    courses.push(this.getCourse());

    new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, '..', 'data', 'courses.json'),
        JSON.stringify(courses),
        (err, content) => {
          if (err) reject(err);
          else resolve(content);
        }
      );
    });
  };
};


module.exports = Course;
