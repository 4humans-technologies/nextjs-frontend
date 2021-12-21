let a = [
  {
    _id: "61b3556725881409e0dff44f",
    tokenAmount: 100,
    forModel: "61ab5bd7709c721f2ce299d4",
    by: {
      _id: "61ac3ced7e756001f4099bda",
      profileImage:
        "https://dreamgirl-public-bucket.s3.ap-south-1.amazonaws.com/rMifD02A495g_ooCsEN1hUvT.jpeg",
      name: "ravi shankar",
    },
    givenFor: 4,
    time: "2021-12-10T13:25:59.000Z",
    __v: 0,
  },
  {
    _id: "61b3558f25881409e0dff457",
    tokenAmount: 20,
    forModel: "61ab5bd7709c721f2ce299d4",
    by: {
      _id: "61ac3ced7e756001f4099bda",
      profileImage:
        "https://dreamgirl-public-bucket.s3.ap-south-1.amazonaws.com/rMifD02A495g_ooCsEN1hUvT.jpeg",
      name: "ravi shankar",
    },
    givenFor: 4,
    time: "2021-12-10T13:26:39.000Z",
    __v: 0,
  },
  {
    _id: "61b355bf25881409e0dff45d",
    tokenAmount: 50,
    forModel: "61ab5bd7709c721f2ce299d4",
    by: {
      _id: "61ac3ced7e756001f4099bda",
      profileImage:
        "https://dreamgirl-public-bucket.s3.ap-south-1.amazonaws.com/rMifD02A495g_ooCsEN1hUvT.jpeg",
      name: "ravi shankar",
    },
    givenFor: 6,
    time: "2021-12-10T13:27:27.000Z",
    __v: 0,
  },
  {
    _id: "61b3595825881409e0dff4dc",
    tokenAmount: 100,
    forModel: "61ab5bd7709c721f2ce299d4",
    by: {
      _id: "61ac3ced7e756001f4099bda",
      profileImage:
        "https://dreamgirl-public-bucket.s3.ap-south-1.amazonaws.com/rMifD02A495g_ooCsEN1hUvT.jpeg",
      name: "ravi shankar",
    },
    givenFor: 6,
    time: "2021-12-10T13:42:48.000Z",
    __v: 0,
  },
  {
    _id: "61b35bc625881409e0dff519",
    tokenAmount: 100,
    forModel: "61ab5bd7709c721f2ce299d4",
    by: {
      _id: "61ac3ced7e756001f4099bda",
      profileImage:
        "https://dreamgirl-public-bucket.s3.ap-south-1.amazonaws.com/rMifD02A495g_ooCsEN1hUvT.jpeg",
      name: "ravi shankar",
    },
    givenFor: 4,
    time: "2021-12-10T13:53:10.000Z",
    __v: 0,
  },
  {
    _id: "61b35bcf25881409e0dff51f",
    tokenAmount: 50,
    forModel: "61ab5bd7709c721f2ce299d4",
    by: {
      _id: "61ac3ced7e756001f4099bda",
      profileImage:
        "https://dreamgirl-public-bucket.s3.ap-south-1.amazonaws.com/rMifD02A495g_ooCsEN1hUvT.jpeg",
      name: "ravi shankar",
    },
    givenFor: 6,
    time: "2021-12-10T13:53:19.000Z",
    __v: 0,
  },
  {
    _id: "61b35bd125881409e0dff526",
    tokenAmount: 100,
    forModel: "61ab5bd7709c721f2ce299d4",
    by: {
      _id: "61ac3ced7e756001f4099bda",
      profileImage:
        "https://dreamgirl-public-bucket.s3.ap-south-1.amazonaws.com/rMifD02A495g_ooCsEN1hUvT.jpeg",
      name: "ravi shankar",
    },
    givenFor: 6,
    time: "2021-12-10T13:53:21.000Z",
    __v: 0,
  },
]
a
let b = a.filter((item) => {
  if (item.tokenAmount < 40) {
    return item
  }
})

console.log(b[0])

let c = a.map((item) => Date.parse(item.time.split("T")[0]))

c

let da = new Date()
da
console.log(Date.parse(da))
console.log(c[1] < Date.parse(da))
