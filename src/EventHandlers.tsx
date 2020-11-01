import {IEventArgs} from "@docsvision/webclient/System/IEventArgs";
import {Layout} from "@docsvision/webclient/System/Layout";
import {IDataChangedEventArgs} from "@docsvision/webclient/System/IDataChangedEventArgs";
import {NumberControl} from "@docsvision/webclient/Platform/Number";
import moment from 'moment'
import {$UrlResolver} from "@docsvision/webclient/System/$UrlResolver";
import {UrlResolver} from "@docsvision/webclient/System/UrlResolver";
import {$RequestManager, IRequestManager} from "@docsvision/webclient/System/$RequestManager";
import {MessageBox} from "@docsvision/webclient/Helpers/MessageBox/MessageBox";

export async function showOrHideAdditionalControls(sender) {
    console.log("1");
    let paymentKindControl = sender.layout.controls.paymentKind;
    let paymentKindId = paymentKindControl.params.value.id;
    let urlResolver = sender.layout.getService($UrlResolver);
    let requestManager = sender.layout.getService($RequestManager);
    await getAdditionalControlsFlag(urlResolver, requestManager, paymentKindId)
        .then((data) => {
            if (data == "True") toggleAdditionalSanatoryControlsExisting(true, sender)
            else if (data == "False") toggleAdditionalSanatoryControlsExisting(false, sender)
            else {
                console.log("Unknown value from Get request!!");
                toggleAdditionalSanatoryControlsExisting(false, sender);
            }
        })
        .catch((e) => {
            MessageBox.ShowError(e, "Поймана ошибка")
        })
}

export function toggleAdditionalSanatoryControlsExisting(value: boolean, sender) {
    let layout = sender.layout.controls;
    let controlsArray = [layout.sanatoryName, layout.fullPrice, layout.summerPrice,
        layout.notSummerPrice, layout.dateTimePicker1, layout.dateTimePicker2, layout.summerDaysQuantity,
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