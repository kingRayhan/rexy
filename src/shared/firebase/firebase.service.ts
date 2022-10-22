import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseService {
  private firebaseAdmin: admin.app.App;

  constructor() {
    this.firebaseAdmin = admin.initializeApp(
      {
        credential: admin.credential.cert(
          path.resolve(`${__dirname}/../../../keys/firebase-admin-key.json`),
        ),
      },
      'rexy-admin',
    );
  }

  public getAdminApp(): admin.app.App {
    return this.firebaseAdmin;
  }
}
