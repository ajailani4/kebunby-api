
# Kebunby Backend

This is a backend app for Kebunby. Kebunby is a platform that can be used for people who want to plant. This platform has a lot of plant informations, such as ornamental plants, vegetable plants, and fruit trees. The informations that served are plant description, tools and materials, also steps for planting. On this platform we can contribute to uploading other plant informations too. Then, we can also see our planting and planted plants, and favorite plants.


## Endpoints

Base URL: ```https://kebunby-backend.herokuapp.com```

All endpoints (except /register and /login) must use this authentication

Request :
- Header :
    - Authentication : "Bearer <token>"

### Register

```http
  POST /api/v1/register
```

Body :

```json 
{
    "username": "string, unique",
	"email": "string",
    "password": "string",
    "name": "string"
}
```

### Login

```http
  POST /api/v1/login
```

Body :

```json 
{
    "username": "string, unique",
    "password": "string"
}
```

### Get Plants (All Plants, Trending Plants, Searched Plants)

```http
  GET /api/v1/plants
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `page` | `number` | **Required**. Used to load the next data |
| `size` | `number` | **Required**. Set limit of result in one page |
| `isTrending` | `boolean` | **Optional**. Get trending plants |
| `searchQuery` | `string` | **Optional**. Get plants based on user search query |

### Get Plant Details

```http
  GET /api/v1/plants/{id}
```

### Upload Plant

```http
  POST /api/v1/plants
```

Body (form-data) :
- name: text
- latinName: text
- image: file
- category: text
- wateringFreq: text
- growthEst: text
- desc: text
- tools: text (**separated by comma**, e.g tool1, tool2)
- materials: text (**separated by comma**, e.g material1, material2)
- steps: text (**separated by comma**, e.g step1, step2)
- author: text

### Update Plant

```http
  PUT /api/v1/plants/{id}
```

Body (form-data) :
- name: text
- latinName: text
- image: file (**optional**)
- category: text
- wateringFreq: text
- growthEst: text
- desc: text
- tools: text (**separated by comma**, e.g tool1, tool2)
- materials: text (**separated by comma**, e.g material1, material2)
- steps: text (**separated by comma**, e.g step1, step2)
- author: text

### Delete Plant

```http
  DELETE /api/v1/plants/{id}
```

### Get Plants by Category

```http
  GET /api/v1/categories/{id}/plants
```

### Get Plant Categories

```http
  GET /api/v1/categories
```

### Get Plants by Username (Posts, Planting Plants, Planted Plants, Favorite Plants)

```http
  GET /api/v1/plants
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `page` | `number` | **Required**. Used to load the next data |
| `size` | `number` | **Required**. Set limit of result in one page |
| `isPlanting` | `boolean` | **Optional**. Get user planting plants |
| `isPlanted` | `boolean` | **Optional**. Get user planted plants |
| `isFavorited` | `boolean` | **Optional**. Get user favorite plants |

### Get User Profile

```http
  GET /api/v1/users/{username}
```
## Tech Stack

Node, Hapi, PostgreSQL, Cloudinary


## Authors

- [@ajailani4](https://www.github.com/ajailani4)
- [@Toolop](https://github.com/Toolop)
