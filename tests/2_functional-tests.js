/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);
function getId(id) {
  return id;
}
suite("Functional Tests", function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  // test("#example Test GET /api/books", function (done) {
  //   chai
  //     .request(server)
  //     .get("/api/books")
  //     .end(function (err, res) {
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, "response should be an array");
  //       assert.property(
  //         res.body[0],
  //         "commentcount",
  //         "Books in array should contain commentcount"
  //       );
  //       assert.property(
  //         res.body[0],
  //         "title",
  //         "Books in array should contain title"
  //       );
  //       assert.property(
  //         res.body[0],
  //         "_id",
  //         "Books in array should contain _id"
  //       );
  //       done();
  //     });
  // });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function () {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "test" })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.isNotNull(res.body._id);
              console.log("is has been set as", res.body._id);
              done();
            });
        });

        test("Test POST /api/books with no title given", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({})
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, "missing required field title");
              done();
            });
          // done();
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "commentcount");
            assert.property(res.body[0], "title");
            assert.property(res.body[0], "_id");
            done();
          });
        // done();
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        // assert.equal(1, 2);
        chai
          .request(server)
          .get("/api/books/5e9b8f8f8f8f8f8f8f8f8f8")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
        // done();
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        // assert.equal(1, 2);
        let id;
        chai
          .request(server)
          .post("/api/books")
          .send({ title: "test with id" })
          .end(function (err, res) {
            id = res.body._id;
            assert.equal(res.status, 200);
            assert.isNotNull(id);
            // console.log("id it has been set as", id);
            chai
              .request(server)
              .get(`/api/books/${id}`)
              .end(function (err, res) {
                // console.log(res, id, "res and id are being printed");
                assert.equal(res.status, 200);
                assert.equal(id, id);
                assert.equal(res.body.title, "test with id");
                assert.isNotNull(res.body._id);
                assert.property(res.body, "title");
                assert.property(res.body, "comments");
                done();
              });
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          // assert.equal(1, 2);
          let id;
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "test with id" })
            .end(function (err, res) {
              id = res.body._id;
              assert.equal(res.status, 200);
              assert.isNotNull(id);
              // console.log("id it has been set as", id);
              chai
                .request(server)
                .post(`/api/books/${id}`)
                .send({ comment: "test comment" })
                .end(function (err, res) {
                  // console.log(res, id, "res and id are being printed");
                  assert.equal(res.status, 200);
                  assert.equal(id, id);
                  assert.equal(res.body.title, "test with id");
                  assert.isTrue(res.body.comments.includes("test comment"));
                  assert.isNotNull(res.body._id);
                  assert.property(res.body, "title");
                  assert.property(res.body, "comments");
                  done();
                });
            });
        });

        test("Test POST /api/books/[id] without comment field", function (done) {
          let id;
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "test with id" })
            .end(function (err, res) {
              id = res.body._id;
              assert.equal(res.status, 200);
              assert.isNotNull(id);
              // console.log("id it has been set as", id);
              chai
                .request(server)
                .post(`/api/books/${id}`)
                .send({})
                .end(function (err, res) {
                  // console.log(res, id, "res and id are being printed");
                  assert.equal(res.status, 200);
                  assert.equal(id, id);
                  assert.equal(res.text, "missing required field comment");
                  done();
                });
            });
        });

        test("Test POST /api/books/[id] with comment, id not in db", function (done) {
          let id;
          chai
            .request(server)
            .post(`/api/books/61cf00814e478e0619b82548`)
            .send({ comment: "test comment" })
            .end(function (err, res) {
              // console.log(res, id, "res and id are being printed");
              assert.equal(res.status, 200);
              assert.equal(id, id);
              assert.equal(res.text, "no book exists");
              done();
            });
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        let id;
        chai
          .request(server)
          .post("/api/books")
          .send({ title: "test with id" })
          .end(function (err, res) {
            id = res.body._id;
            assert.equal(res.status, 200);
            assert.isNotNull(id);
            // console.log("id it has been set as", id);
            chai
              .request(server)
              .delete(`/api/books/${id}`)
              .end(function (err, res) {
                // console.log(res, id, "res and id are being printed");
                assert.equal(res.status, 200);
                assert.equal(id, id);
                assert.equal(res.text, "delete successful");
                done();
              });
          });
      });

      test("Test DELETE /api/books/[id] with  id not in db", function (done) {
        let id;
        chai
          .request(server)
          .post("/api/books")
          .send({ title: "test with id" })
          .end(function (err, res) {
            id = res.body._id;
            assert.equal(res.status, 200);
            assert.isNotNull(id);
            // console.log("id it has been set as", id);
            chai
              .request(server)
              .delete(`/api/books/id-not-in-db`)
              .end(function (err, res) {
                // console.log(res, id, "res and id are being printed");
                assert.equal(res.status, 200);
                assert.equal(id, id);
                assert.equal(res.text, "no book exists");
                done();
              });
          });
      });
    });
  });
});
