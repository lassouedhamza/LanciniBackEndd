const asyncHandler =require ('express-async-handler')
const project =require ('../models/projectmodel.js')
const sendEmail = require('../utils/sendEmail');
const ErrorResponse = require('../utils/errorResponse');
let {PythonShell} = require('python-shell')
const { getMaxListeners } = require('../models/projectmodel.js')
// @desc    Fetch all projects
// @route   GET /api/projects
// @access  Public
const getprojects = asyncHandler(async (req, res) => {
  const pageSize = 3
  const page = Number(req.query.pageNumber) || 1
  const keyword = req.query.keyword
  ? {
      name: {
        $regex: req.query.keyword,
        $options: 'i',
      },
    }
  : {}
  const count = await project.countDocuments({ ...keyword })
  const projects = await project.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({ projects, page, pages: Math.ceil(count / pageSize) })
})
// @desc    Fetch single project
// @route   GET /api/projects/:id
// @access  Public
const getprojectById = asyncHandler(async (req, res) => {
  const projects = await project.findById(req.params.id)
  if (projects) {
    res.json(projects)
  } else {
    res.status(404)
    throw new Error('project not found')
  }
})
// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteproject = asyncHandler(async (req, res) => {
  const projects = await project.findById(req.params.id)
  if (projects) {
    await projects.remove()
    res.json({ message: 'project removed' })
  } else {
    res.status(404)
    throw new Error('project not found')
  }
})


// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
const createproject = asyncHandler( (req, res) => {
 
  let r=false
  const  {
    name,
    price,
    description,
     image,
     username,
    Userid,
     category,
     video,
     p,
     Position,
     verification,
     email,
  } = req.body
  
  let options = {
    args: [verification]
    }
    setTimeout(() => {
  PythonShell.run("verification.py",options, function(err,results){
    if(err){
        console.log(err)
        console.log("An error takes place")
    }
    else {
        if(results=="1"){
        console.log("yes");
        r=true;
        console.log(r);
        }
        else{
        console.log("no")  
        }
    }
})
}, 1000);
 
setTimeout(() => {
  

if(r){
  const projects = new project({
    name: name,
    price: price,
    creator:Userid,
    image: image,
    video:video,
    creatorname: username,
    Position: Position,
    category: category,
    countInStock: 0,
    numReviews: 0,
    description: description,
    verification: verification,
    email: email,
  })

  const createdproject =  projects.save()
  res.status(201).json(createdproject)
 console.log("hamza")
 // HTML Message
 const message =`<!DOCTYPE html>
 <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
 <head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width,initial-scale=1">
   <meta name="x-apple-disable-message-reformatting">
   <title></title>
   <!--[if mso]>
   <noscript>
     <xml>
       <o:OfficeDocumentSettings>
         <o:PixelsPerInch>96</o:PixelsPerInch>
       </o:OfficeDocumentSettings>
     </xml>
   </noscript>
   <![endif]-->
   <style>
     table, td, div, h1, p {font-family: Arial, sans-serif;}
   </style>
 </head>
 <body style="margin:0;padding:0;">
   <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
     <tr>
       <td align="center" style="padding:0;">
         <table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
           <tr>
             <td align="center" style="padding:40px 0 30px 0;background:#70bbd9;">
               <img src="https://purplepaper.fundition.io/img/icon/map.png" alt="" width="300" style="height:auto;display:block;" />
             </td>
           </tr>
           <tr>
             <td style="padding:36px 30px 42px 30px;">
               <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                 <tr>
                   <td style="padding:0 0 36px 0;color:#153643;">
                     <h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;">Hi ${username}</h1>
                     <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">welcome to the business world </p>
                     
                   </td>
                 </tr>
                 <tr>
                   <td style="padding:0;">
                     <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                     
                     </table>
                   </td>
                 </tr>
               </table>
             </td>
           </tr>
           <tr>
             <td style="padding:30px;background:#ee4c50;">
               <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;">
                 <tr>
                   <td style="padding:0;width:50%;" align="left">
                     <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#ffffff;">
                       &reg; lancini 2022<br/><a href="http://lancini-lassouedhamza.vercel.app" style="color:#ffffff;text-decoration:underline;">lancini</a>
                     </p>
                   </td>
                   <td style="padding:0;width:50%;" align="right">
                     <table role="presentation" style="border-collapse:collapse;border:0;border-spacing:0;">
                       <tr>
                         <td style="padding:0 0 0 10px;width:38px;">
                           <a href="http://www.twitter.com/" style="color:#ffffff;"><img src="https://assets.codepen.io/210284/tw_1.png" alt="Twitter" width="38" style="height:auto;display:block;border:0;" /></a>
                         </td>
                         <td style="padding:0 0 0 10px;width:38px;">
                           <a href="http://www.facebook.com/" style="color:#ffffff;"><img src="https://assets.codepen.io/210284/fb_1.png" alt="Facebook" width="38" style="height:auto;display:block;border:0;" /></a>
                         </td>
                       </tr>
                     </table>
                   </td>
                 </tr>
               </table>
             </td>
           </tr>
         </table>
       </td>
     </tr>
   </table>
 </body>
 </html>`;
 

 sendEmail({
  to: email,
  subject: "Project submitted",
  text: message,
});

//res.status(200).json({ success: true, data: "Email Sent" });



}else{
  console.log("tay")
  console.log(email)
  
 

// HTML Message
const message =`<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width,initial-scale=1">
	<meta name="x-apple-disable-message-reformatting">
	<title></title>
	<!--[if mso]>
	<noscript>
		<xml>
			<o:OfficeDocumentSettings>
				<o:PixelsPerInch>96</o:PixelsPerInch>
			</o:OfficeDocumentSettings>
		</xml>
	</noscript>
	<![endif]-->
	<style>
		table, td, div, h1, p {font-family: Arial, sans-serif;}
	</style>
</head>
<body style="margin:0;padding:0;">
	<table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
		<tr>
			<td align="center" style="padding:0;">
				<table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
					<tr>
						<td align="center" style="padding:40px 0 30px 0;background:#70bbd9;">
							<img src="https://purplepaper.fundition.io/img/icon/map.png" alt="" width="300" style="height:auto;display:block;" />
						</td>
					</tr>
					<tr>
						<td style="padding:36px 30px 42px 30px;">
							<table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
								<tr>
									<td style="padding:0 0 36px 0;color:#153643;">
										<h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;">Hi ${username}</h1>
										<p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">sorry your project is declined.<br> to submit your project you must follow this 2 step  </p>
										
									</td>
								</tr>
								<tr>
									<td style="padding:0;">
										<table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
											<tr>
												<td style="width:260px;padding:0;vertical-align:top;color:#153643;">
													<p style="margin:0 0 25px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><img src="https://assets.codepen.io/210284/left.gif" alt="" width="260" style="height:auto;display:block;" /></p>
													<p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">Get your document from OTDAV</p>
													<p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><a href="http://www.otdav.tn" style="color:#ee4c50;text-decoration:underline;">OTDAV</a></p>
												</td>
												<td style="width:20px;padding:0;font-size:0;line-height:0;">&nbsp;</td>
												<td style="width:260px;padding:0;vertical-align:top;color:#153643;">
													<p style="margin:0 0 25px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><img src="https://assets.codepen.io/210284/right.gif" alt="" width="260" style="height:auto;display:block;" /></p>
													<p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">upload your document in our website  </p>
													<p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><a href="http://lancini-lassouedhamza.vercel.app/addproject" style="color:#ee4c50;text-decoration:underline;">lancini</a></p>
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>
					<tr>
						<td style="padding:30px;background:#ee4c50;">
							<table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;">
								<tr>
									<td style="padding:0;width:50%;" align="left">
										<p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#ffffff;">
											&reg; lancini 2022<br/><a href="http://lancini-lassouedhamza.vercel.app" style="color:#ffffff;text-decoration:underline;">lancini</a>
										</p>
									</td>
									<td style="padding:0;width:50%;" align="right">
										<table role="presentation" style="border-collapse:collapse;border:0;border-spacing:0;">
											<tr>
												<td style="padding:0 0 0 10px;width:38px;">
													<a href="http://www.twitter.com/" style="color:#ffffff;"><img src="https://assets.codepen.io/210284/tw_1.png" alt="Twitter" width="38" style="height:auto;display:block;border:0;" /></a>
												</td>
												<td style="padding:0 0 0 10px;width:38px;">
													<a href="http://www.facebook.com/" style="color:#ffffff;"><img src="https://assets.codepen.io/210284/fb_1.png" alt="Facebook" width="38" style="height:auto;display:block;border:0;" /></a>
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>`;

   sendEmail({
    to: email,
    subject: "lancini",
    text: message,

  });

  res.status(200).json({ success: true, data: "Email Sent" });


 
}
}, 10000);
})

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin

const updateproject = asyncHandler(async (req, res) => {

  const {
    name,
    price,
    // description,
     image,
    // brand,
    // category,
    // countInStock,
  } = req.body

  const projects = await project.findById(req.params.id)

  if (projects) {
    projects.name = name
    projects.price = price
  //   projects.description = description
    projects.image = image
  //  // project.brand = brand
  //   projects.category = category
  //   projects.p = p

    const updatedproject = await projects.save()
    res.json(updatedproject)
  } else {
    res.status(404)
    throw new Error('project not found')
  }
}
)
// @desc    Create new review
// @route   POST /api/projects/:id/reviews
// @access  Private
const createprojectReview = asyncHandler(async (req, res) => {
  const { rating, comment ,username ,Userid } = req.body

  const projects = await project.findById(req.params.id)

  if (projects) {
    const alreadyReviewed = projects.reviews.find(
      (r) => r.creator.toString() === Userid.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('project already reviewed')
    }

    const review = {
      name: username,
      rating: Number(rating),
      comment :comment,
      creator: Userid ,
    }

    projects.reviews.push(review)

    projects.numReviews = projects.reviews.length

    projects.rating =
      projects.reviews.reduce((acc, item) => item.rating + acc, 0) /
      projects.reviews.length

    await projects.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('project not found')
  }
})

module.exports = {
  getprojects,
  getprojectById,
  deleteproject,
  createproject,
  updateproject,
  createprojectReview,
}

