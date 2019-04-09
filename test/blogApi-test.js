const chai = require("chai");
const chaiHttp = require("chai-http");

const {
    app,
    runServer,
    closeServer
} = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

describe('blogApi', function () {
    before(function () {
        return runServer();
    });

    after(function () {
        return closeServer();
    });

    it('it should list blog post on GET', function () {
        return chai.request(app)
            .get("/blog")
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.at.least(1);
                const expectedKeys = ['title', 'content', 'authorName', "id", "publishDate"];
                res.body.forEach(function (item) {
                    expect(item).to.be.a("object");
                    expect(item).to.include.keys(expectedKeys);
                });

            });
    });

    it('it should add blog post on POST', function () {
        const newBlog = {
            title: "Lorem ip some",
            content: "foo foo foo foo",
            authorName: "Emma Goldman"
        };
        const expectedKeys = ["id", "publishDate"].concat(Object.keys(newBlog));
        return chai.request(app)
            .post("/blog")
            .send(newBlog)
            .then(function (res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a("object");
                expect(res.body).to.have.all.keys(expectedKeys);
                expect(res.body.title).to.equal(newBlog.title);
                expect(res.body.content).to.equal(newBlog.content);
                expect(res.body.authorName).to.equal(newBlog.authorName);
            });
    });

    it('it should update blog post on PUT', function () {
        const updatedPost = {
            authorName: 'carlos',
            title: "example post",
            content: "la la la la la"
        };
        return chai.request(app)
            .get('/blog')
            .then(function (res) {
                updatedPost.id = res.body[0].id;

                return chai.request(app)
                    .put(`/blog/${updatedPost.id}`)
                    .send(updatedPost)
            })
            .then(function (res) {
                // console.log(res);
                expect(res).to.have.status(204);
            })
        // .catch(err => console.log(err))

    });

    it("should delete blog post on DELETE", function () {
        return (
            chai.request(app)

            .get("/blog")
            .then(function (res) {
                return chai.request(app).delete(`/blog/${res.body[0].id}`);
            })
            .then(function (res) {
                expect(res).to.have.status(204);
            })
        );
    });


});