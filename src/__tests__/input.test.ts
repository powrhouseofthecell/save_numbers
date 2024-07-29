import request from 'supertest';
import app, { server } from '../main'

describe('Numbers should be saved in the right files', () => {

  describe('POST /input', () => {
    it('should save the number in the appropriate file', async () => {
      const response_1 = await request(app)
        .post('/input')
        .send({
          number: 30,
        });

      const response_2 = await request(app)
        .post('/input')
        .send({
          number: 15,
        });

      const response_3 = await request(app)
        .post('/input')
        .send({
          number: 10,
        });

      const response_4 = await request(app)
        .post('/input')
        .send({
          number: 5,
        });

      expect(response_1.text).toBe("Number 210 stored in files/A.txt.")
      expect(response_2.text).toBe("Number 105 stored in files/B.txt.")
      expect(response_3.text).toBe("Number 70 stored in files/C.txt.")
      expect(response_4.text).toBe("Number 35 stored in files/D.txt.")

      expect(response_1.status).toBe(200);
      expect(response_2.status).toBe(200);
      expect(response_3.status).toBe(200);
      expect(response_4.status).toBe(200);
    });
  });


  describe('GET /files', () => {
    it('should get all the file data in the form of array', async () => {
      const response = await request(app)
        .get('/files')

      expect(response.body['files/A.txt'][0]).toBe('210')
      expect(response.body['files/B.txt'][0]).toBe('105')
      expect(response.body['files/C.txt'][0]).toBe('70')
      expect(response.body['files/D.txt'][0]).toBe('35')

      expect(response.status).toBe(200);
    });

  });

  afterAll(() => {
    server.close()
  })

});


