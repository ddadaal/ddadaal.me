import * as React from 'react'
import 'gitment/style/default.css'
import Gitment from 'gitment'

interface Props {

}

export class CommentContainer extends React.Component<Props, {}> {

  componentDidMount() {
    // console.log(Gitment);
    // const gitment = new Gitment.Gitment({
    //   id: 'Your page ID', // optional
    //   owner: 'viccrubs',
    //   repo: 'VicBlog-Gatsby-Comments',
    //   oauth: {
    //     client_id: '5640259688bc3d72b807',
    //     client_secret: 'bbe26de2fca2ea86e49a98e883caf9ff3102c4ff',
    //   },
    //   // ...
    //   // For more available options, check out the documentation below
    // })
    //
    // gitment.render('comments')
  }

  render() {
    return <div>Comment system is under construction.</div>
  }
}
