import React, { useEffect } from "react";
import { useParams } from "react-router";
import { Helmet } from "react-helmet";

import "./NDATemplate.css";

export default function NDATemplate() {
	let { Params } = useParams();
	Params = JSON.parse(decodeURIComponent(atob(Params)));

	useEffect(() => {
		window.print();
	}, []);

	return (
		<div className="d-flex justify-content-center mt-5">
			<Helmet>
				<title>cnam - {Params.company_name} NDA</title>
			</Helmet>
			<div className="container-fluid" style={{ padding: "1% 10%" }}>
				<div className="justify-content-center">
					{/* <!----- row -----> */}
					<div className="row">
						<div className="col-6">
							<div className="h5 text-center">KING ABDULLAH UNIVERSITY OF SCIENCE AND TECHNOLOGY NON-DISCLOSURE AGREEMENT</div>
							<div className="h5 text-center"></div>
						</div>
						<div className="col-6">
							<div className="h5 text-center">
								{" "}
								<span style={{ color: "transparent" }}>.</span>جامعة الملك عبدالله للعلوم والتقنية{" "}
							</div>
							<div className="h5 text-center">اتفاقية عدم الإفصاح</div>
						</div>
					</div>

					{/* <!----- row -----> */}
					<div className="row">
						<div className="col-6">
							<div className="mt-2">
								his Non-Disclosure Agreement (“Agreement”) of <span class="date_en fw-bold">{Params.date}</span> (“Effective Date”) is
								made between <span class="collab_en fw-bold">{Params.company_name}</span>, having its principal place of business at{" "}
								<span class="location_en fw-bold">{Params.headquarter}</span> - Kingdom of Saudi Arabia. a (here in after called
								“Collaborator”) and KING ABDULLAH UNIVERSITY OF SCIENCE AND TECHNOLOGY (hereinafter called “cnam”), each referred to
								as a “Party” and collectively as the “Parties.” In consideration of the mutual promises and covenants contained
								herein, the Parties agree as follows:
							</div>
						</div>
						<div className="col-6" style={{ textAlign: "right", direction: "rtl" }}>
							<div className="mt-2">
								أُبرمت اتفاقية عدم الإفصاح الحالية ("الاتفاقية") بتاريخ
								<span className="date_ar fw-bold">{Params.date_ar} </span>
								("تاريخ السريان") بين
								<span className="collab_ar fw-bold"> {Params.company_name_ar} </span>، ويقع مقرها الرئيسي في
								<span className="location_ar fw-bold"> {Params.headquarter_ar} </span>
								المملكة العربية السعودية.
								<br />
								(المشار إليها فيما يلي باسم "المتعاون") وجامعة الملك عبدالله للعلوم والتقنية (المشار إليها فيما يلي بـ " كاوست")، يشار
								إلى كل منهما باسم " الطرف"ويشار إليهما معاً بـ"الطرفين". في ظل التعهدات المتبادلة الواردة في الاتفاقية الحالية، اتفق
								الطرفان على ما يلي:
							</div>
						</div>
					</div>
				</div>
				<div className="row mt-2">
					<div className="col-6">1. Definition of Confidential Information</div>
					<div className="col-6" style={{ textAlign: "right", direction: "rtl" }}>
						1. تعريف المعلومات السرية
					</div>
				</div>
				<div className="row mt-2">
					<div className="col-6">
						As used herein, with the exceptions as stated in Section 2, “Confidential Information,” when capitalized, is defined as
						information that a Party (the “Disclosing Party”) considers confidential and discloses to the other Party (the “Receiving
						Party”) by any means, that
					</div>
					<div className="col-6" style={{ textAlign: "right", direction: "rtl" }}>
						<span>
							<span style={{ color: "transparent", width: "0" }}>l</span>على النحو المستخدم في هذه الاتفاقية ومع الاستثناءات الواردة في
							بند 2، "المعلومات السرية" ، والتي أوضح فيها أحد الأطراف أنها معلومات سرية ("الطرف المفصح") إذا أصيغت بحروف كبيرة، ويتم
							الإفصاح عنها للطرف الآخر ("الطرف المستلم") بأي وسيلة والتي:
						</span>
					</div>
				</div>
				<div className="row mt-1">
					<div className="col-6">a. Is marked as “confidential” or “proprietary” or</div>
					<div className="col-6" style={{ textAlign: "right", direction: "rtl" }}>
						<span>أ. يتم تصنيفها بأنها "سرية" أو "مملوكة" أو؛</span>
					</div>
				</div>
				<div className="row mt-1">
					<div className="col-6">
						b.Is disclosed orally or by visual demonstration and such information (i) was previously identified in writing as confidential
						or proprietary or (ii) is identified orally at the time of disclosure and then reduced in writing within thirty (30) days
						thereafter and marked as confidential or proprietary, however the lack of such reduction to writing shall not negate the
						confidential nature of such Confidential Information nor remove obligations to such Confidential Information contained herein
					</div>
					<div className="col-6" style={{ textAlign: "right", direction: "rtl" }}>
						<span>
							ب. يُفصح عنها شفويًا أو عن طريق العرض المرئي وكانت تلك المعلومات (1) محددة مسبقًا كتابيًا على أنها سرية أو مملوكة أو (2)
							تم تعريفها شفويًا أثناء الإفصاح عنها ثم تمَّ توثيقها كتابةً في غضون ثلاثين (30) يومًا بعد ذلك بتصنيفها على أنها سرية أو
							مملوكة، مع العلم أن عدم توثيقها كتابياً لا يبطل طابع السرية لهذه المعلومات ولا يبطل الالتزامات الناشئة عن المعلومات السرية
							الواردة بهذه الاتفاقية.{" "}
						</span>
					</div>
				</div>

				<div className="break-after-here"></div>
				<br />
				<br />
				<br />
				<br />
				<div className="row mt-1">
					<div className="col-6">
						c. CONFIDENTIAL INFORMATION includes, without limitation, technical information marketing and business plans, accounting
						information, databases, specifications, formulations, tooling, samples, prototypes, sketches, models, drawings,
						specifications, procurement requirements, engineering information, computer software (source and object codes), forecasts,
						identity of or details about actual or potential customers or projects, techniques, inventions, discoveries, know-how and
						trade secrets, whether it is received, accessed or viewed by Recipient in writing, visually, electronically or orally
					</div>
					<div className="col-6" style={{ textAlign: "right", direction: "rtl" }}>
						<span>
							ج. تشمل المعلومات السرية، على سبيل المثال لا الحصر، المعلومات التقنية وخطط التسويق والأعمال والمعلومات المحاسبية وقواعد
							البيانات والمواصفات والمركبات والأدوات والعينات والنماذج الأولية والرسومات والنماذج والمخططات والمواصفات ومتطلبات الشراء
						</span>
					</div>
				</div>
				<div className="row mt-2">
					<div className="col-6">2. Exceptions to Confidential Information</div>
					<div className="col-6" style={{ textAlign: "right", direction: "rtl" }}>
						<span>2. استثناءات المعلومات السرية</span>
					</div>
				</div>
				<div className="row mt-1">
					<div className="col-6">
						a. Is known at the time of disclosure, or later becomes known, to the general public, other than as a result of the breach of
						this Agreement;{" "}
					</div>
					<div className="col-6" style={{ textAlign: "right", direction: "rtl" }}>
						<span>
							أ. تكون متاحة لعامة الجمهور، أثناء وقت الإفصاح أو تكون متاحة لاحقًا، لأسباب أخرى لا تتعلق بمخالفة أحكام هذه الاتفاقية؛
						</span>
					</div>
				</div>

				<div className="row mt-1">
					<div className="col-6">
						b. Can be shown by competent written evidence to have been known by the Receiving Party before its receipt from the Disclosing
						Party;{" "}
					</div>
					<div className="col-6" style={{ textAlign: "right", direction: "rtl" }}>
						<span>ب. يتبين من خلال وثائق مكتوبة ومقبولة أنَّ الطرف المستلم كان مطلع عليها قبل استلامها من الطرف المفصح؛</span>
					</div>
				</div>
				<div className="row mt-1">
					<div className="col-6">
						c. Is received by the Receiving Party, without any obligations of confidentiality, from a third party who has the legal right
						to disclose it; or
					</div>
					<div className="col-6" style={{ textAlign: "right", direction: "rtl" }}>
						<span>ج. تم استلامها من قبل الطرف المستلم، والذي لا يخضع لالتزام يتعلق بالسرية، من طرف ثالث مخول له بالإفصاح عنها؛ أو</span>
					</div>
				</div>

				<div className="row mt-1">
					<div className="col-6">
						d. Is independently developed by the Receiving Party without the use of other Confidential Information, as shown by clear and
						convincing written evidence.
					</div>
					<div className="col-6" style={{ textAlign: "right", direction: "rtl" }}>
						<span>
							د. تم تطويرها بشكل مستقل بواسطة الطرف المستلم دون استخدام أياً من المعلومات السرية الأخرى، بموجب توثيق كتابي واضح ومقبول.
						</span>
					</div>
				</div>

				<div className="row mt-2">
					<div className="col-6">3. Protection of Confidential Information</div>
					<div className="col-6" style={{ textAlign: "right", direction: "rtl" }}>
						<span>3. حماية المعلومات السرية</span>
					</div>
				</div>

				<div className="row mt-1">
					<div className="col-6">
						business and consulting opportunities (“Purposes”). With respect to the Disclosing Party’s Confidential Information, a
						Receiving Party shall:
					</div>
					<div className="col-6" style={{ textAlign: "right", direction: "rtl" }}>
						<span>
							<span style={{ color: "transparent", width: "0" }}>l</span>يرغب الطرفان في استكشاف فرص البحث والتطوير المحتملة والأعمال
							والا
						</span>
					</div>
				</div>

				<div className="break-after-here"></div>
				<br />
				<br />
				<br />
				<br />
				<div className="row mt-1">
					<div className="col-6">
						a. Use reasonable means to protect the confidentiality of Confidential Information, which are at least as diligent as the
						means used to safeguard its own most confidential information;
					</div>
					<div className="col-6" style={{ textAlign: "right", direction: "rtl" }}>
						<span>
							أ. استخدام وسائل معقولة لحماية سرية المعلومات السرية، أي بنفس المستوى والإجراءات المستخدمة لحماية معلوماته السرية؛
						</span>
					</div>
				</div>

				<div className="row mt-1">
					<div className="col-6">b. Use such Confidential Information solely for the Purposes;</div>
					<div className="col-6" style={{ textAlign: "right", direction: "rtl" }}>
						ب. استخدام تلك المعلومات السرية للأغراض المشار إليها فقط؛
					</div>
				</div>
				<div className="row mt-1">
					<div className="col-6">
						c. Not disclose such Confidential Information to any third party, except representatives, consultants, or subcontractors,
						authorized by the Disclosing Party and engaged to assist in pursuing the Purposes, who are bound to protect the Confidential
						Information, using the same reasonable means, provided in this Agreement as being applicable to the Receiving Party, or as
						otherwise authorized in writing by the Disclosing Party; and
					</div>
					<div className="col-6" style={{ textAlign: "right", direction: "rtl" }}>
						<span>
							ج. عدم الإفصاح عن هذه المعلومات السرية لأي طرف ثالث باستثناء الممثلين أو المستشارين أو المقاولين من الباطن المصرح لهم من
							قبل الطرف المفصح لتحقيق الأغراض المشار إليها، والملتزمين بحماية المعلومات السرية باستخدام نفس الوسائل المعقولة المنصوص
							عليها في هذه الاتفاقية، باعتبارها نافذة في حق الطرف المستلم، أو على النحو الذي يأذن به الطرف المفصح كتابةً؛{" "}
						</span>
					</div>
				</div>

				<div className="row mt-1">
					<div className="col-6">
						d. not disclose such confidential information to any person within its own organization who does not have a need to know in
						order to carry out one or more purposes.{" "}
					</div>
					<div className="col-6" style={{ textAlign: "right", direction: "rtl" }}>
						<span>
							د. عدم الإفصاح عن هذه المعلومات السرية لأي شخص داخل منشأته والتي لا يستوجب الاطلاع عليها أو معرفتها من أجل تحقيق الأغراض
							المشار إليها.{" "}
						</span>
					</div>
				</div>

				<div className="row mt-1">
					<div className="col-6">4. Required Disclosure</div>
					<div className="col-6" style={{ textAlign: "right", direction: "rtl" }}>
						4. الإفصاح اللازم
					</div>
				</div>

				<div className="row mt-1">
					<div className="col-6">
						A Receiving Party may disclose Confidential Information to the extent required by a valid order from a court or other
						governmental body, after first notifying the Disclosing Party in writing of the order.{" "}
					</div>
					<div className="col-6" style={{ textalign: "right", direction: "rtl" }}>
						<span style={{ color: "transparent", width: "0" }}>l</span>يجوز للطرف المستلم الإفصاح عن المعلومات السرية بالقدر الذي يقتضيه
						حكم أو أمر صادر من محكمة أو هيئة حكومية، بعد أن تم إخطار الطرف المفصح كتابة على الحكم أو الأمر الصادر.
					</div>
				</div>

				<div className="row mt-2">
					<div className="col-6">5. Points of Contact</div>
					<div className="col-6" style={{ textalign: "right", direction: "rtl" }}>
						5. جهات الاتصال
					</div>
				</div>

				<div className="row mt-1">
					<div className="col-6">
						For the purpose of administering this Agreement, the primary points of contact, with respect to the transmission, receipt
					</div>
					<div className="col-6" style={{ textalign: "right", direction: "rtl" }}>
						<span style={{ color: "transparent", width: "0" }}>l</span> لغرض تنفيذ هذه الاتفاقية، يتم تحديد جهات الاتصال الأساسية فيما
						يتعلق بنقل واستلام والتحكم بالمعلومات السرية المتبادلة لغرض
					</div>
				</div>
				<div className="row mt-1">
					<div className="col-6">
						For the purpose of administering this Agreement, the primary points of contact, with respect to the transmission, receipt
						<div className="break-after-here"></div>
						<br />
						<br />
						<br />
						<br />
						and control of Confidential Information exchanged hereunder and for providing notices required by or relating to this
						Agreement, are designated by the respective Parties as follows:
					</div>
					<div className="col-6" style={{ textalign: "right", direction: "rtl" }}>
						لغرض تنفيذ هذه الاتفاقية، يتم تحديد جهات الاتصال الأساسية فيما يتعلق بنقل واستلام والتحكم بالمعلومات السرية المتبادلة لغرض
						<div className="break-after-here"></div>
						<br />
						<br />
						<br />
						<br />
						إرسال الإشعارات التي يتعين توجيهها بموجب هذه الاتفاقية أو فيما يتعلق بها، من قبل الأطراف المعنيين على النحو التالي:
					</div>
				</div>

				<div className="row mt-3">
					<div className="col-6">
						<div class="h6 mt-2">For cnam</div>
						<div>Name: Sean P. Flanigan</div>
						<div>Title: Director, Technology Transfer Office</div>
						<div>
							Address: 4700 King Abdullah University of Science & Technology cnam Box 2916 Thuwal 23955-6900 Kingdom of Saudi Arabia
						</div>
						<div>Email: IP@cnam.EDU.SA</div>
					</div>
					<div className="col-6" style={{ textalign: "right", direction: "rtl" }}>
						<div className="h6 mt-2" style={{ textalign: "left", direction: "ltr" }}>
							For Collaborator{" "}
						</div>
						<span style={{ textalign: "right", direction: "rtl" }}>
							<span>
								اسم: <span className="name_en fw-bold">{Params.name_ar}</span>
							</span>
							<br />
							<span>
								لقب:<span className="title_en fw-bold">{Params.title_ar}</span>
							</span>
							<br />
							<span>
								عنوان: <span className="address_en fw-bold">{Params.address_ar}</span>
							</span>
							<br />
							<span>
								بريد الالكتروني: <span className="email_en fw-bold">{Params.email}</span>
							</span>
							<br />
						</span>
					</div>
				</div>

				<div className="row mt-1">
					<div className="col-6">
						Whenever feasible, the Parties shall transmit their Confidential Information between these points of contact. However,
						Confidential Information shall not lose protection by virtue of receipt by another employee or agent of a Party.
					</div>
					<div className="col-6" style={{ textalign: "right", direction: "rtl" }}>
						المشار إليها، دون أن يؤثر على حماية المعلومات السرية في حال تسلمها من قبل موظف آخر أو وكيل لطرف آخر.
					</div>
				</div>

				<div className="row mt-3">
					<div className="col-6">6. Ownership of Confidential Information</div>
					<div className="col-6" style={{ textalign: "right", direction: "rtl" }}>
						6. ملكية المعلومات السرية
					</div>
				</div>
				<div className="row mt-1">
					<div className="col-6">
						All Confidential Information, including all copies thereof, shall remain the property of the Disclosing Party. All
						Confidential Information and copies thereof shall be returned to the Disclosing Party upon the written request of the
						Disclosing Party at any time.{" "}
					</div>
					<div className="col-6" style={{ textalign: "right", direction: "rtl" }}>
						<span style={{ color: "transparent", width: "0" }}>l</span> تظل جميع المعلومات السرية، بما في ذلك جميع نسخها، ملكًا للطرف
						المفصح، على أن يتم إعادة جميع المعلومات السرية ونسخها إلى الطرف المفصح بناء على طلب كتابي من الطرف المفصح في أي وقت.
					</div>
				</div>

				<div className="row mt-2">
					<div className="col-6">7. No Warranties</div>
					<div className="col-6" style={{ textalign: "right", direction: "rtl" }}>
						7. عدم تقديم ضمانات
					</div>
				</div>

				<div className="row mt-1">
					<div className="col-6">
						Neither Party makes any warranty of any kind with respect to Confidential Information, including in particular but without
						limitation, warranties of merchantability, fitness for any purpose and non-infringement of trademarks, patents, copyrights,
						trade secrets, right of
						<div className="break-after-here"></div>
						<br />
						<br />
						<br />
						<br />
						privacy, or any other rights of third persons. Neither Party assumes any responsibility or liability whatever under this
						Agreement for the results of use of the Confidential Information by the Receiving Party or others.{" "}
					</div>
					<div className="col-6" style={{ textalign: "right", direction: "rtl" }}>
						<span style={{ color: "transparent", width: "0" }}>l</span> لا يجوز لأياً من الأطراف تقديم ضمانات فيما يتعلق بالمعلومات
						السرية، بما في ذلك على وجه الخصوص وليس الحصر، ضمانات التسويق والملائمة لأي غرض، ومنها عدم انتهاك حقوق العلامات التجارية، أو
						براءات الاختراع، أو حقوق المؤلف والنشر، أو الأسرار التجارية، أو حق الخصوصية أو أياً من حقوق الغير. كما لا يتحمل
						<div className="break-after-here"></div>
						<br />
						<br />
						<br />
						<br />
						أي من الأطراف أي مسؤولية بموجب هذه الاتفاقية عن نتائج استخدام المعلومات السرية من قبل الطرف المستلم أو غيره.
					</div>
				</div>
				<div className="row mt-2">
					<div className="col-6">8. No Implied Licenses</div>
					<div className="col-6" style={{ textalign: "right", direction: "rtl" }}>
						8. عدم استخراج تراخيص
					</div>
				</div>
				<div className="row mt-1">
					<div className="col-6">
						No license is created under this Agreement, nor shall any be implied therefrom under any patent, trademark, application,
						copyright, trade secret, or other intellectual property right of either Party, other than the use of Confidential Information
						for the Purposes and subject to the limitations of this Agreement.
					</div>
					<div className="col-6" style={{ textalign: "right", direction: "rtl" }}>
						<span style={{ color: "transparent", width: "0" }}>l</span> لا ينشأ بموجب هذه الاتفاقية أي ترخيص ولا يجوز تضمين أي منها بموجب
						براءة اختراع، أو علامة تجارية، أو حقوق المؤلف، أو الأسرار التجاري أو أياً من الحقوق الملكية الفكرية الأخرى لكلاً من الطرفين،
						إلا في حدود استخدام المعلومات السرية للأغراض المشار إليها والاستثناءات الواردة بموجب هذه الاتفاقية.
					</div>
				</div>
				<div className="row mt-2">
					<div className="col-6">9. Independent Contractors </div>
					<div className="col-6" style={{ textalign: "right", direction: "rtl" }}>
						9. المتعاقدون المستقلون
					</div>
				</div>
				<div className="row mt-1">
					<div className="col-6">
						Each Party is an independent contractor. Neither is an agent of the other for any purpose whatsoever, and neither shall have
						any authority to bind the other.
					</div>
					<div className="col-6" style={{ textalign: "right", direction: "rtl" }}>
						<span style={{ color: "transparent", width: "0" }}>l</span> يُعد كل طرف بموجب هذه الاتفاقية طرف مستقل وأنه ليس وكيلًا للآخر
						لأي غرض كان، ولا يُخول لأياً من الأطراف إلزام الآخر على عكس ذلك.{" "}
					</div>
				</div>
				<div className="row mt-2">
					<div className="col-6">10. Non-Disclosure Agreement Term </div>
					<div className="col-6" style={{ textalign: "right", direction: "rtl" }}>
						10. مدة اتفاقية عدم الإفصاح
					</div>
				</div>
				<div className="row mt-1">
					<div className="col-6">
						a. This Agreement shall take effect on the Effective Date when executed by both Parties. All obligations under this Agreement
						shall expire three (3) years after the Effective Date, except the obligations of the Receiving Party, relative to Confidential
						Information, which shall survive during the term of this Agreement and for a period of three (3) years from the expiration or
						termination of this Agreement. Either party may terminate this Agreement upon thirty (30) days prior written notice to the
						other party without any cause.{" "}
					</div>
					<div className="col-6" style={{ textalign: "right", direction: "rtl" }}>
						<span style={{ color: "transparent", width: "0" }}>l</span> أ. تسري هذه الاتفاقية من تاريخ السريان فور إبرامها من قبل الطرفين
						وتنقضي جميع الالتزامات بموجب الاتفاقية بعد ثلاث (3) سنوات من تاريخ السريان، باستثناء التزامات الطرف المستلم فيما يتعلق
						بالمعلومات السرية والتي تكون نافذة خلال مدة هذه الاتفاقية ولمدة ثلاث (3) سنوات من انتهاء أو إنهاء هذه الاتفاقية، ويجوز لأي من
						الطرفين إنهاء هذه الاتفاقية بناءً على إشعار كتابي مسبق قبل ثلاثين (30) يومًا للطرف الآخر دون أي سبب.
					</div>
				</div>

				<div className="break-after-here"></div>
				<br />
				<br />
				<br />
				<br />
				<div className="row mt-1">
					<div className="col-6">
						b. Confidential Information that was disclosed by the Disclosing Party to the Receiving Party prior to the Effective Date of
						this Agreement shall also be governed by the confidentiality and use restrictions set forth in this Agreement.
					</div>
					<div className="col-6" style={{ textalign: "right", direction: "rtl" }}>
						<span style={{ color: "transparent", width: "0" }}>l</span> ب. تخضع المعلومات السرية التي تم الإفصاح عنها من قبل الطرف المفصح
						للطرف المستلم قبل تاريخ سريان هذه الاتفاقية أيضًا لقيود السرية والاستخدام المنصوص عليها في هذه الاتفاقية.
					</div>
				</div>
				<div className="row mt-2">
					<div className="col-6">11. Governing Law and Enforcement </div>
					<div className="col-6" style={{ textalign: "right", direction: "rtl" }}>
						11. القانون الواجب التطبيق
					</div>
				</div>

				<div className="row mt-1">
					<div className="col-6">
						This Agreement is made under and shall be construed according to the laws of the Kingdom of Saudi Arabia, without reference to
						conflicts of law provisions or principles.{" "}
					</div>
					<div className="col-6" style={{ textalign: "right", direction: "rtl" }}>
						<span style={{ color: "transparent", width: "0" }}>l</span> أُبرمت هذه الاتفاقية بموجب قوانين المملكة العربية السعودية ويخضع
						تفسيرها وتنفيذها وفقًا لها دون اللجوء إلى قواعد الاسناد أو مبادئه.
					</div>
				</div>
				<div className="row mt-2">
					<div className="col-6">12.Entire Agreement and Modifications </div>
					<div className="col-6" style={{ textalign: "right", direction: "rtl" }}>
						12. الاتفاقية الكاملة والتعديلات
					</div>
				</div>

				<div className="row mt-1">
					<div className="col-6">
						This Agreement is made under and shall be construed according to the laws of the Kingdom of Saudi Arabia, without reference to
						conflicts of law provisions or principles.{" "}
					</div>
					<div className="col-6" style={{ textalign: "right", direction: "rtl" }}>
						<span style={{ color: "transparent", width: "0" }}>l</span> تحل هذه الاتفاقية بما في ذلك ملحق "أ" محل أي اتفاقيات كتابية أو
						شفوية مسبقة تتعلق بتبادل المعلومات والأغراض المحددة في ملحق "أ"، ولا يجوز تعديل الاتفاقية أو تغييرها إلا بموجب اتفاقية كتابية
						لاحقة وموقعة من قبل ممثلي الطرفين المفوضين بذلك.
					</div>
				</div>
				<div className="row ">
					<div className="col-6">
						IN WITNESS WHEREOF, the Parties have caused this Agreement to be duly executed in duplicate originals by their duly authorized
						representatives. The Parties to this Agreement agree that a copy of original signature(s), including scanned/electronic copy,
						can substitute original signature(s). The Parties further waive the right to challenge the admissibility or authenticity of
						this document based solely on the absence of original signature(s).{" "}
					</div>
					<div className="col-6" style={{ textalign: "right", direction: "rtl" }}>
						<span style={{ color: "transparent", width: "0" }}>l</span> تحل هذه الاتفاقية بما في ذلك ملحق "أ" محل أي اتفاقيات كتابية أو
						شفوية مسبقة تتعلق بتبادل المعلومات والأغراض المحددة في ملحق "أ"، ولا يجوز تعديل الاتفاقية أو تغييرها إلا بموجب اتفاقية كتابية
						لاحقة وموقعة من قبل ممثلي الطرفين المفوضين بذلك.
						<br />
						<strong>وبناء على ما تقدم،</strong>أوعز الطرفان لممثليهم المفوضين أصولاً بإبرام هذه الاتفاقية في نسختين، واتفق الطرفان على أن
						نسخة من التوقيع/ التوقيعات الأصلي/ة، بما في ذلك نسخة ممسوحة ضوئيًا / إلكترونية، يمكن أن تحل محل التوقيع/ التوقيعات الأصلي/ة،
						ويتنازل الطرفان كذلك عن حقهما بالطعن في صحة هذه الاتفاقية على أساس عدم تضمنها لتوقيع/توقيعات أصلي/ة.
					</div>
				</div>

				<div className="break-after-here"></div>
				<br />
				<br />
				<br />
				<br />
				<div className="row">
					<div className="col-6">
						<div className=" mb-4 h6 text-decoration-underline">
							Each signatory below certifies that they are authorized to execute legally binding commitments on behalf of their named
							Party.
						</div>

						<div className="h5">KING ABDULLAH UNIVERSITY OF SCIENCE AND TECHNOLOGY </div>
					</div>
					<div className="col-6" style={{ textAlign: "right", direction: "rtl" }}>
						<span className=" mt-3 h6 text-decoration-underline">
							<span style={{ color: "transparent" }}>.</span>يشهد كل مفوض بالتوقيع أدناه على أنه مخول بتنفيذ الالتزامات والأحكام الملزمة
							نيابةً عن الطرف المذكور.
						</span>

						<div style={{ textAlign: "left", minHeight: "60px" }}>
							<br />
							<span className="collab_ar h5">{Params.company_name}</span>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-6">
						<div>By: ________________</div>
						<div>Name: Sean P. Flanigan</div>

						<div style={{ textAlign: "right" }}>الاسم: شون فلانيغن</div>
						<div>Title: Director, Technology Transfer Office</div>
						<div>Date: ________________</div>
					</div>

					<div className="col-6 text-right">
						<div style={{ textAlign: "left" }}>By:_______________________________</div>
						<div>{Params.name_ar} :الاسم </div>
						<div style={{ textAlign: "left" }}>Name: {Params.name}</div>
						<div style={{ textAlign: "left" }}>
							Title: <span className="title_ar">{Params.title}</span>
						</div>
						<div style={{ textAlign: "left" }}>Date:_______________________________ </div>
					</div>
				</div>
			</div>
		</div>
	);
}
