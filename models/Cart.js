const fs = require('fs');
const path = require('path');

const dataPath = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);


class Cart {
  static async fetch() {
    return new Promise((resolve, reject) => {
      fs.readFile(dataPath, 'utf-8', (err, content) => {
        if (err) reject(err);
        else resolve(JSON.parse(content));
      });
    });
  };

  static async add(course) {
    const cart = await Cart.fetch();
    const courses = cart.courses;
    const ndx = courses.findIndex((c) => c.id === course.id);
    const candidate = courses[ndx];

    if (candidate) {
      candidate.count++;
      courses[ndx] = candidate;
    } else {
      course.count = 1;
      courses.push(course);
    }

    cart.price += parseInt(course.price);

    return new Promise((resolve, reject) => {
      fs.writeFile(dataPath, JSON.stringify(cart), (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  };

  static async remove(id) {
    const cart = await Cart.fetch();

    const ndx = cart.courses.findIndex((c) => c.id === id);
    const course = cart.courses[ndx];

    if (course.count === 1) {
      cart.courses = cart.courses.filter((c) => c.id !== id);
    } else {
      course.count--;
      cart.courses[ndx] = course;
    }

    cart.price -= course.price;

    return new Promise((resolve, reject) => {
      fs.writeFile(dataPath, JSON.stringify(cart), (err) => {
        if (err) reject(err);
        else resolve(cart);
      });
    });
  };
}


module.exports = Cart;
