# AWS Terraform by Example

A hands-on guide to building AWS infrastructure with Terraform.

## What we're building

A classified ads application where users interact with a chatbot to manage their ads (CRUD operations). Other users can view and search ads on a website hosted on AWS. We'll cover authentication, authorization, and production-ready infrastructure patterns.

**Example chatbot interaction**

[![](https://mermaid.ink/img/pako:eNqVU11v00AQ_CujExWJsPOFePFDKhoH2gckSBtVVczD4Vs3Vs93xncGoiT_nbXdloASVZwfvLc7mp0dr7citYpEJM7OcF_Jco2bODF8ac773mwt_YX1WF71_2QRhlPMtrdcw8bWFXLjyfjz_TNk1kB2aUXS0w7xatZGn63zVy306z9ILqsd5qsFv0-j6lK1fB9WyzY6jVSkqUF-XMVt9BcSSExiHH2vyaQU55LnLpo0cFkX0oTT6RueOcIl6bLL85Vpp2FbjxDbZm78lMbDW3RzBuj0BWimCWArdDIgUXL_82MtOmOONmnsfe3g1wSfe02wWef2SbJPMr2w9gHjSSLQm4zG7_oI8eV2vri542Bu7nXu1ugtr_svdVTk0iovfW7Ny30XlNXVN6Ym9T8akLFF1ugNXk1Go8FxSbbWqjVb5w8EJ3_QgRhsyA2NPaaJKyc-naEB7pgwlQaODujA67z2vnTRcEi_ZFFqGqS2GI4nb5uF6R4cHBGIgqpC5or_n227WILNKygREYeKMllrn4jE7Bnabcdc5d5WIsqkdhQIWXt7vTGpiHxV0xPocScfUfvfG2EmEA)](https://mermaid.live/edit#pako:eNqVU11v00AQ_CujExWJsPOFePFDKhoH2gckSBtVVczD4Vs3Vs93xncGoiT_nbXdloASVZwfvLc7mp0dr7citYpEJM7OcF_Jco2bODF8ac773mwt_YX1WF71_2QRhlPMtrdcw8bWFXLjyfjz_TNk1kB2aUXS0w7xatZGn63zVy306z9ILqsd5qsFv0-j6lK1fB9WyzY6jVSkqUF-XMVt9BcSSExiHH2vyaQU55LnLpo0cFkX0oTT6RueOcIl6bLL85Vpp2FbjxDbZm78lMbDW3RzBuj0BWimCWArdDIgUXL_82MtOmOONmnsfe3g1wSfe02wWef2SbJPMr2w9gHjSSLQm4zG7_oI8eV2vri542Bu7nXu1ugtr_svdVTk0iovfW7Ny30XlNXVN6Ym9T8akLFF1ugNXk1Go8FxSbbWqjVb5w8EJ3_QgRhsyA2NPaaJKyc-naEB7pgwlQaODujA67z2vnTRcEi_ZFFqGqS2GI4nb5uF6R4cHBGIgqpC5or_n227WILNKygREYeKMllrn4jE7Bnabcdc5d5WIsqkdhQIWXt7vTGpiHxV0xPocScfUfvfG2EmEA)

## Approach

We use Infrastructure as Code (IaC) with Terraform to provision and manage AWS services. This gives us:

- **Version control** — infrastructure changes are tracked in Git
- **Reproducibility** — spin up identical environments reliably
- **Documentation** — configuration files serve as living documentation
- **Change management** — review infrastructure changes before applying

## Get started

<a href="/guide/" class="vp-button">Start the guide →</a>
