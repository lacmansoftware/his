import { config } from '@/config/axios/config'
import { MockMethod } from 'vite-plugin-mock'

const { result_code } = config

const timeout = 1000

const List: {
  username: string
  password: string
  role: string
  roleId: string
}[] = [
    {
      username: 'admin',
      password: 'admin',
      role: 'admin',
      roleId: '1'
    },
    {
      username: 'test',
      password: 'test',
      role: 'test',
      roleId: '2'
    }
  ]

export default [
  // 列表接口
  {
    url: '/user/list',
    method: 'get',
    response: ({ query }) => {
      const { username, pageIndex, pageSize } = query

      const mockList = List.filter((item) => {
        if (username && item.username.indexOf(username) < 0) return false
        return true
      })
      const pageList = mockList.filter(
        (_, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
      )

      return {
        code: result_code,
        data: {
          total: mockList.length,
          list: pageList
        }
      }
    }
  },
  // 登录接口
  {
    url: '/user/login',
    method: 'post',
    timeout,
    response: ({ body }) => {
      const data = body
      let hasUser = false
      for (const user of List) {
        if (user.username === data.username && user.password === data.password) {
          hasUser = true
          return {
            code: result_code,
            data: user
          }
        }
      }
      if (!hasUser) {
        return {
          code: '500',
          message: '账号或密码错误'
        }
      }
    }
  },
  // 退出接口
  {
    url: '/user/loginOut',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: result_code,
        data: null
      }
    }
  },
  // User Login
  {
    url: '/index/login/system',
    method: 'post',
    timeout,
    response: () => {
      return {
        "code": result_code,
        "msg": "登录成功",
        "data": "",
        "total": 1,
        "success": true,
        "notifyCompleted": true,
        "_t": null
      }
    }
  },
  // User Info
  {
    url: '/index/userinfo',
    method: 'get',
    timeout,
    response: () => {
      return {
        "code": result_code,
        "msg": null,
        "data": {
          "id": null,
          "userId": "1736c55ccc9349e0bc0ef261705b50eb",
          "mobile": "13163403234",
          "name": "李陽",
          "age": null,
          "gender": null,
          "memberId": null,
          "birthday": null,
          "pageNum": 1,
          "pageSize": 2147483647,
          "headImg": null,
          "userType": "system",
          "hospitalId": "MD_guanshe",
          "pharmacyId": null,
          "hospitalName": "官捨店",
          "seatNo": "",
          "seatPassword": "",
          "bindingTel": "",
          "password": "d623b63e14d3111ecd398c6842468b6a",
          "pharmacyList": [
            "YFmlyf",
            "YFgsyf"
          ],
          "deptIds": null
        },
        "total": 0,
        "success": true,
        "notifyCompleted": true,
        "_t": null
      }
    }
  },
] as MockMethod[]
