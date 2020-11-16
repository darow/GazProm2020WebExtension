import {IEventArgs} from "@docsvision/webclient/System/IEventArgs";
import {Layout} from "@docsvision/webclient/System/Layout";
import {IDataChangedEventArgs} from "@docsvision/webclient/System/IDataChangedEventArgs";
import {NumberControl} from "@docsvision/webclient/Platform/Number";
import moment from 'moment'
import {$UrlResolver} from "@docsvision/webclient/System/$UrlResolver";
import {UrlResolver} from "@docsvision/webclient/System/UrlResolver";
import {$RequestManager, IRequestManager} from "@docsvision/webclient/System/$RequestManager";
import {MessageBox} from "@docsvision/webclient/Helpers/MessageBox/MessageBox";

export async function fillCandAgreementInfoStr(sender) {
    let controls = sender.layout.controls
    let cardIdControl = controls.links.params.links[0].data.linkId

}

export async function getCandAgreementInfoStr(urlResolver: UrlResolver, requestManager: IRequestManager, cardId: string) {
    let url = urlResolver.resolveApiUrl("GetStaffDepManById", "RowDesignerService");
    url += "?id=" + cardId;
    return requestManager.get(url);
}

export async function fillStaffDepManager(sender) {
    let staffDepControl = sender.layout.controls.staffDepartment
    let staffDepManagerControl = sender.layout.controls.staffDepartmentManager
    let staffDepId = staffDepControl.value.id
    if (staffDepId != null) {
        let urlResolver = sender.layout.getService($UrlResolver);
        let requestManager = sender.layout.getService($RequestManager);
        await getStaffDepManager(urlResolver, requestManager, staffDepId)
            .then((data: string) => {
                staffDepManagerControl.value = data;
            })
    }
}

export async function getStaffDepManager(urlResolver: UrlResolver, requestManager: IRequestManager, staffDepId: string) {
    let url = urlResolver.resolveApiUrl("GetStaffDepManById", "RowDesignerService");
    url += "?id=" + staffDepId;
    return requestManager.get(url);
}

export async function fillAgreementAndBookKeepers(sender) {
    console.log('start')
    let folderControl = sender.layout.controls.folder
    console.log(folderControl)
    let folderP = folderControl.params
    console.log(folderP)
    let folderVal = folderControl.params.value
    console.log(folderVal)
    let folderID = folderControl.params.value.id
    console.log(folderID)

    let controls = sender.layout.controls
    let headerText = controls.headerLabel.props.text;

    let urlResolver = sender.layout.getService($UrlResolver);
    let requestManager = sender.layout.getService($RequestManager);

    await getAgreementPersonsAndBookKeepers(urlResolver, requestManager, folderID)
        .then((data: string) => {
            if (data['staffDepartment']) {
                controls.staffDepartment.value = data["staffDepartment"]
            }
            if (headerText == "Приказ по благотворительности") {
                if (data['charityOrderMainBookKeeper']) {
                    controls.mainBookKeeper.value = data["charityOrderMainBookKeeper"]
                }
                if (data['charityOrderBookKeeper']) {
                    controls.bookKeeper.value = data["charityOrderBookKeeper"]
                }
                if (data['charityOrderController']) {
                    controls.controller.value = data["charityOrderController"]
                }
                if (data['charityOrderAgreementEmployees']) {
                    controls.agreementPersons.value = data['charityOrderAgreementEmployees']
                }
            } else if (headerText == "Лист согласования кандиадата") {
                if (data['candidateAgreementCPKBoss']) {
                    controls.CPKChief.value = data['candidateAgreementCPKBoss']
                }
                if (data['candidateAgreementOUandOTOBoss']) {
                    controls.OUandOTOChief.value = data['candidateAgreementOUandOTOBoss']
                }
                if (data['candidateAgreementAgreementEmployees']) {
                    controls.agreementEmployees.value = data['candidateAgreementAgreementEmployees']
                }
            } else if (headerText == 'Карточка документов при приеме') {
                if (data['recruitmentDocsOUandOTOClerk']) {
                    controls.OUandOTOClerk.value = data['recruitmentDocsOUandOTOClerk']
                }
                if (data['recruitmentDocsOUandOTOBoss']) {
                    controls.OUandOTOChief.value = data['recruitmentDocsOUandOTOBoss']
                }
                if ((data['recruitmentDocsAgreementEmployees1'])&&(data['recruitmentDocsHeadOfDepartment'])) {
                    let agreementArr = [data['recruitmentDocsHeadOfDepartment']]
                    if ((controls.acceptOrTranslate.value == "Перевод")||(controls.acceptOrTranslate.value == "Приём"))
                        agreementArr = agreementArr.concat(data['recruitmentDocsAgreementEmployees1'])
                    controls.coordinatingPersons.value = agreementArr
                }
                if (data['recruitmentDocsAgreementEmployees2']) {
                    controls.coordinatingPersons1.value = data['recruitmentDocsAgreementEmployees2']
                }
            } else if (headerText == "Приказ на выплату") {
                if (data['payOrderMainBookKeeper']) {
                    controls.mainBookKeeper.value = data['payOrderMainBookKeeper']
                }
                if (data['payOrderBookKeeper']) {
                    controls.bookKeeper.value = data['payOrderBookKeeper']
                }
                if (data['payOrderAgreementEmployees']) {
                    controls.contributePersons.value = data['payOrderAgreementEmployees']
                }
            }
        })
        .catch((e) => {
            MessageBox.ShowError(e, "Поймана ошибка")
        })
}

export async function getAgreementPersonsAndBookKeepers(urlResolver: UrlResolver, requestManager: IRequestManager, folderId: string) {
    let url = urlResolver.resolveApiUrl("GetOrganizationByFolderId", "RowDesignerService");
    url += "?id=" + folderId;
    return requestManager.get(url);
}

export async function logPostRequest(sender) {
    let urlResolver = sender.layout.getService($UrlResolver);
    let requestManager = sender.layout.getService($RequestManager);

    await postRequest(urlResolver, requestManager)
        .then((data: string) => {
            console.log(data)
        })
        .catch((ex)=>{
            console.log(ex)
        })
}


export async function postRequest(urlResolver: UrlResolver, requestManager: IRequestManager) {
    let url = urlResolver.resolveApiUrl("ChangeState", "RowDesignerService");
    let postdata = {
        idList: ["df4d5173-a3f6-483c-bdcf-c14a1c1fb068", "2020eb64e772-10d5-4c30-be66-94ed6d4a3b8a"],
        stateName: "Drafting"
        // "AddedToOrder" "Drafting"
    }
    return requestManager.post(url, JSON.stringify(postdata));
}

export async function showOrHideAdditionalControlsAndFillCode(sender) {
    let paymentKindControl = sender.layout.controls.paymentKind;
    let paymentKindId = paymentKindControl.params.value.id;
    let urlResolver = sender.layout.getService($UrlResolver);
    let requestManager = sender.layout.getService($RequestManager);
    await getAdditionalControlsFlag(urlResolver, requestManager, paymentKindId)
        .then((data: string) => {
            sender.layout.controls.paymentKindCode.params.value = data['payCode'];
            if (data['showAdditionalControls'] == "true")
                toggleAdditionalSanatoryControls(true, sender)
            else if (data['showAdditionalControls'] == "false")
                toggleAdditionalSanatoryControls(false, sender)
            else {
                console.log("Unknown value from Get request!!");
                toggleAdditionalSanatoryControls(false, sender);
            }
        })
        .catch((e) => {
            MessageBox.ShowError(e, "Поймана ошибка")
        })
}

export function toggleAdditionalSanatoryControls(value: boolean, sender) {
    let layout = sender.layout.controls
    let controlsArray = [layout.sanatoryName, layout.fullPrice, layout.summerPrice,
        layout.notSummerPrice, layout.dateStart, layout.dateEnd, layout.summerDaysQuantity,
        layout.notSummerDaysQuantity, layout.workersQuantity, layout.childrenQuantity, layout.spouseQuantity,]
    controlsArray.map((i) => {
        i.params.required = value;
    });
    let additionalBlock = layout.additionalData;
    additionalBlock.params.visibility = value;
}

export async function getAdditionalControlsFlag(urlResolver: UrlResolver, requestManager: IRequestManager, paymentKindid: string) {
    let url = urlResolver.resolveApiUrl("GetPaymentKindInfo", "RowDesignerService");
    url += "?id=" + paymentKindid;
    return requestManager.get(url);
}

export function SetCreationDate(sender: Layout, e: IEventArgs) {
    let CreationDateControl = sender.layout.controls.CreatedDate;
    CreationDateControl.params.value = moment();
}

export function UpdateCandidateFIO(sender: Layout, e: IEventArgs) {
    let candiadateFIOControl = sender.layout.controls.candidate;
    let candiadateSurNameControl = sender.layout.controls.candidateSurname;
    let candiadateNameControl = sender.layout.controls.candidateName;
    let candiadatePatronymicControl = sender.layout.controls.candidatePatronymic;
    let FIO = '';

    if (candiadateSurNameControl.params.value != null) {
        FIO += candiadateSurNameControl.params.value + ' ';
    }
    if (candiadateNameControl.params.value != null) {
        FIO += candiadateNameControl.params.value + ' ';
    }
    if (candiadatePatronymicControl.params.value != null) {
        FIO += candiadatePatronymicControl.params.value;
    }
    candiadateFIOControl.params.value = FIO;
}