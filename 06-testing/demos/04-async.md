# 04 Async

In this example we are going to learn test async code.

We will start from `03-debug`.

Summary steps:

- Handle `getMembers` errors.
- Test async code.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

Let's remove all `calculator` stuff.

- `./src/business/calculator.business.ts`
- `./src/business/index.ts`
- `./src/calculator.spec.ts`
- `./src/calculator.ts`
- `./src/second.spec.ts`

Create a simple `app` to retrieve data from `github`:

_./src/api-model.ts_

```javascript
export interface Member {
  id: number;
  login: string;
  avatar_url: string;
}
```

_./src/api.ts_

```javascript
import Axios, { AxiosError } from 'axios';
import { type Member } from './api-model.js';

const url = 'https://api.github.com/orgs/lemoncode/members';

export const getMembers = (): Promise<Member[]> =>
  Axios.get(url)
    .then((response) => response.data)
    .catch((error: AxiosError) => {
      switch (error?.response?.status) {
        case 403:
          throw 'Too much Github API calls!';
        case 503:
          throw 'Unavailable service';
      }
    });

```

_./src/view-model.ts_

```javascript
export interface Member {
  id: string;
  login: string;
  avatarUrl: string;
}
```

_./src/mapper.ts_

```javascript
import * as apiModel from './api-model.js';
import * as viewModel from './view-model.js';

export const mapMemberListFromApiToVm = (
  members: apiModel.Member[]
): viewModel.Member[] => members.map(member => mapMemberFromApiToVm(member));

const mapMemberFromApiToVm = (member: apiModel.Member): viewModel.Member => ({
  id: member.id.toString(),
  login: member.login,
  avatarUrl: member.avatar_url,
});
```

_./src/app.tsx_

```ts
import React from 'react';
import { getMembers } from './api.js';
import { mapMemberListFromApiToVm } from '#mapper.js';

export const App: React.FunctionComponent = () => {
  React.useEffect(() => {
    getMembers()
      .then((members) => {
        console.log(mapMemberListFromApiToVm(members));
      })
      .catch((error) => console.log(error));
  }, []);

  return <h1>05-Testing / 01 React</h1>;
};

```

Run it:

```bash
npm start
```

Let's start to test it:

_./src/api.spec.ts_

```javascript
import { getMembers } from './api';

describe('getMembers specs', () => {
  it('', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

Should return members when it resolves the request successfully:

_./src/api.spec.ts_

```diff
+ import Axios from 'axios';
+ import { Member } from './api-model';
import { getMembers } from './api';

describe('getMembers specs', () => {
- it('', () => {
+ it('should return members when it resolves the request successfully', () => {
    // Arrange
+   const members: Member[] = [
+     {
+       id: 1,
+       login: 'test login',
+       avatar_url: 'test avatar_url',
+     },
+   ];

+   vi.spyOn(Axios, 'get').mockResolvedValue({
+     data: members,
+   });

    // Act
+   const result = getMembers();

    // Assert
+   expect(Axios.get).toHaveBeenCalledWith(
+     'https://api.github.com/orgs/lemoncode/members'
+   );
+   expect(result).toEqual(members);
  });
});

```

Why is it failing? Because it's an async code and we have to tell `vitest` that it has to wait to resolve `promise`:

_./src/api.spec.ts_

```diff
import Axios from 'axios';
import { Member } from './api-model';
import { getMembers } from './api';

describe('getMembers specs', () => {
- it('should return members when it resolves the request successfully', () => {
+ it('should return members when it resolves the request successfully', async () => {
    // Arrange
    const members: Member[] = [
      {
        id: 1,
        login: 'test login',
        avatar_url: 'test avatar_url',
      },
    ];

    vi.spyOn(Axios, 'get').mockResolvedValue({
      data: members,
    });

    // Act
-   const result = getMembers();
+   const result = await getMembers();

    // Assert
    expect(Axios.get).toHaveBeenCalledWith(
      'https://api.github.com/orgs/lemoncode/members'
    );
    expect(result).toEqual(members);
  });
});

```

> Old way [Done callback](https://vitest.dev/guide/migration.html#done-callback)

Should throw an error with "Too much Github API calls!" when it rejects the request with 403 status code:

_./src/api.spec.ts_

```diff
- import Axios from 'axios';
+ import Axios, { AxiosError } from 'axios';
import { Member } from './api-model';
import { getMembers } from './api';
...

+ it('should throw an error with "Too much Github API calls!" when it rejects the request with 403 status code', async () => {
+   // Arrange
+   vi.spyOn(Axios, 'get').mockRejectedValue({
+     response: {
+       status: 403,
+     },
+   } as AxiosError);

+   // Act
+   try {
+     await getMembers();
+   } catch (error) {
+     // Assert
+     expect(Axios.get).toHaveBeenCalledWith(
+       'https://api.github.com/orgs/lemoncode/members'
+     );
+     expect(error).toEqual('Too much Github API calls!');
+   }
+ });
...

```

Alternatively, you can use `expect().rejects`:

_./src/api.spec.ts_

```diff
...
it('should throw an error with "Unavailable service" when it rejects the request with 503 status code', async () => {
  // Arrange
  vi.spyOn(Axios, 'get').mockRejectedValue({
    response: {
      status: 403,
    },
  } as AxiosError);

  // Act
- try {
-   const result = await getMembers();
+   const result = () => getMembers();
- } catch (error) {
    // Assert
    expect(Axios.get).toHaveBeenCalledWith(
      'https://api.github.com/orgs/lemoncode/members'
    );
-   expect(error).toEqual('Too much Github API calls!');
+   expect(result).rejects.toEqual('Too much Github API calls!');
  }
});

```

> Or like `expect(getMembers).rejects.toEqual('Too much Github API calls!');`

Should throw an error with "Unavailable service" when it rejects the request with 503 status code:

_./src/api.spec.ts_

```diff
...

+ it('should throw an error with "Unavailable service" when it rejects the request with 503 status code', async () => {
+   // Arrange
+   vi.spyOn(Axios, 'get').mockRejectedValue({
+     response: {
+       status: 503,
+     },
+   } as AxiosError);

+   // Act
+   try {
+     const result = await getMembers();
+   } catch (error) {
+     // Assert
+     expect(Axios.get).toHaveBeenCalledWith(
+       'https://api.github.com/orgs/lemoncode/members'
+     );
+     expect(error).toEqual('Unavailable service');
+   }
+ });
...

```

Should return undefined when it rejects the request with different status code:

_./src/api.spec.ts_

```diff
...

+ it('should return undefined when it rejects the request with different status code', async () => {
+   // Arrange
+   vi.spyOn(Axios, 'get').mockRejectedValue({
+     response: {
+       status: 404,
+     },
+   } as AxiosError);

+   // Act
+   const result = await getMembers();
+   // Assert
+   expect(Axios.get).toHaveBeenCalledWith(
+     'https://api.github.com/orgs/lemoncode/members'
+   );
+   expect(result).toBeUndefined();
+ });
...

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
